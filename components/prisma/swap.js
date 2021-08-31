class Swap {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async unique(txHash, index) {
        return await this.prisma.swap.findUnique({
            where: {
                transactionHash_index: {
                    transactionHash: txHash,
                    index: index
                }
            }
        });
    }

    async create(params) {
        return await this.prisma.swap.create({
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
                amount0In: params.amount0In,
                amount1In: params.amount1In,
                amount0Out: params.amount0Out,
                amount1Out: params.amount1Out,
                to: params.to
            }
        });
    }
}

module.exports = Swap;