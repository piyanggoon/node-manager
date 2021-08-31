class Mint {
    constructor(prisma) {
        this.prisma = prisma;
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