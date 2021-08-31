class Transaction {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async unique(hash, index) {
        return await this.prisma.transaction.findUnique({
            where: {
                hash_index: {
                    hash: hash,
                    index: index
                }
            }
        });
    }

    async create(params) {
        return await this.prisma.transaction.create({
            data: {
                hash: params.hash,
                index: params.index,
                Block: {
                    connect: {
                        number: params.blockNumber
                    }
                },
                timestamp: params.timestamp
            }
        });
    }
}

module.exports = Transaction;