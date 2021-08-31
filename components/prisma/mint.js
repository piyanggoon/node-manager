class Mint {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async unique(txHash, index) {
        return await this.prisma.mint.findUnique({
            where: {
                transactionHash_index: {
                    transactionHash: txHash,
                    index: index
                }
            }
        });
    }

    async create(params) {
        return await this.prisma.mint.create({
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
                amount1: params.amount1
            }
        });
    }
}

module.exports = Mint;