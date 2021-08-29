class Pair {
    constructor(node, prisma) {
        this.node = node;
        this.prisma = prisma;
    }

    async get(hash) {
        let findPair = await this.prisma.pair.get(hash);
        if (!findPair) {
            let pair = await this.node.getPair(hash);
            if (pair) {
                let token0 = await this.prisma.token.get(pair.token0.hash);
                if (!token0) {
                    await this.prisma.token.create({
                        hash: pair.token0.hash,
                        name: pair.token0.name,
                        symbol: pair.token0.symbol
                    });
                }
    
                let token1 = await this.prisma.token.get(pair.token1.hash);
                if (!token1) {
                    await this.prisma.token.create({
                        hash: pair.token1.hash,
                        name: pair.token1.name,
                        symbol: pair.token1.symbol
                    });
                }
    
                await this.prisma.pair.create({
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
        return findPair;
    }
}

module.exports = Pair;