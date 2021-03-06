class Reserves {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async unique(blockNumber, hash) {
        return await this.prisma.reserves.findUnique({
            where: {
                blockNumber_pairHash: {
                    blockNumber: blockNumber,
                    pairHash: hash
                }
            }
        });
    }

    async create(params) {
        return await this.prisma.reserves.create({
            data: {
                Block: {
                    connect: {
                        number: params.blockNumber
                    }
                },
                Pair: {
                    connect: {
                        hash: params.hash
                    }
                },
                reserve0: params.reserve0,
                reserve1: params.reserve1,
                timestamp: params.timestamp
            }
        });
    }
}

module.exports = Reserves;