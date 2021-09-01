class Sync {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async unique(txHash, index) {
        return await this.prisma.sync.findUnique({
            where: {
                transactionHash_index: {
                    transactionHash: txHash,
                    index: index
                }
            }
        });
    }

    async create(params) {
        return await this.prisma.sync.create({
            data: {
                Transaction: {
                    connect: {
                        hash: params.txHash
                    }
                },
                Pair: {
                    connect: {
                        hash: params.pairHash
                    }
                },
                index: params.index,
                reserve0: params.reserve0,
                reserve1: params.reserve1
            }
        });
    }
}

module.exports = Sync;