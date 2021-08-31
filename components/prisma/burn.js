class Burn {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async unique(txHash, index) {
        return await this.prisma.burn.findUnique({
            where: {
                transactionHash_index: {
                    transactionHash: txHash,
                    index: index
                }
            }
        });
    }

    async create(params) {
        return await this.prisma.burn.create({
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
                sender: params.sender,
                amount0: params.amount0,
                amount1: params.amount1,
                to: params.to
            }
        });
    }
}

module.exports = Burn;