class Pair {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async get(hash) {
        return await this.prisma.pair.findUnique({
            where: {
                hash: hash
            },
            include: {
                Token0: true,
                Token1: true
            }
        });
    }

    async create(params) {
        return await this.prisma.pair.create({
            data: {
                hash: params.hash,
                factory: params.factory,
                Token0: {
                    connect: {
                        hash: params.token0.hash
                    }
                },
                Token1: {
                    connect: {
                        hash: params.token1.hash
                    }
                }
            }
        });
    }
}

module.exports = Pair;