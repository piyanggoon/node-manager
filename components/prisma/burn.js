class Burn {
    constructor(prisma) {
        this.prisma = prisma;
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
                sender: params.sender,
                amount0: params.amount0,
                amount1: params.amount1,
                to: params.to
            }
        });
    }
}

module.exports = Burn;