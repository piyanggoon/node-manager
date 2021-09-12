class Pair {
    constructor(node, prisma, queue) {
        this.node = node;
        this.prisma = prisma;
        this.queue = queue;
    }

    async get(hash) {
        let find = await this.prisma.pair.get(hash);
        if (!find) {
            return await this.queue.add(async (self, hash) => {
                let findDup = await self.prisma.pair.get(hash);
                if (!findDup) {
                    let pair = await self.node.getPair(hash);
                    if (pair) {
                        let func = async (self, token) => {
                            let result = await self.prisma.token.get(token.hash);
                            if (!result) {
                                await self.prisma.token.create({
                                    hash: token.hash,
                                    name: token.name,
                                    symbol: token.symbol
                                });
                            }
                        };
                        
                        let findToken0 = await self.prisma.token.get(pair.token0.hash);
                        if (!findToken0) {
                            await self.queue.add(func, [self, pair.token0], pair.token0.hash);
                        }

                        let findToken1 = await self.prisma.token.get(pair.token1.hash);
                        if (!findToken1) {
                            await self.queue.add(func, [self, pair.token1], pair.token1.hash);
                        }
            
                        await self.prisma.pair.create({
                            hash: hash,
                            factory: pair.factory,
                            token0: {
                                hash: pair.token0.hash
                            },
                            token1: {
                                hash: pair.token1.hash
                            }
                        });
            
                        return pair;
                    }
                }
                return findDup;
            }, [this, hash], hash);
        }
        return find;
    }
}

module.exports = Pair;