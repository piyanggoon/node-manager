const Queue = require('../classes/queue.js');

class Pair {
    constructor(node, prisma) {
        this.node = node;
        this.prisma = prisma;
        this.queue = new Queue();
    }

    async get(hash) {
        return await this.queue.add(async (self, hash) => {
            let find = await self.prisma.pair.get(hash);
            if (!find) {
                let pair = await self.node.getPair(hash);
                if (pair) {
                    let func = async (self, token) => {
                        let result = await self.prisma.token.get(token.hash);
                        if (!result) {
                            return await self.prisma.token.create({
                                hash: token.hash,
                                name: token.name,
                                symbol: token.symbol
                            });
                        }
                        return result;
                    };
                    
                    let token0 = await this.queue.add(func, [self, pair.token0], pair.token0.hash);
                    let token1 = await this.queue.add(func, [self, pair.token1], pair.token1.hash);
        
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
            return find;
        }, [this, hash], hash);
    }
}

module.exports = Pair;