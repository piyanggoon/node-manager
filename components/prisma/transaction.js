class Transaction {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async getTransaction(hash) {
        return await this.prisma.transaction.findFirst({
            where: {
                hash: hash
            }
        });
    }
    
    async getTransactions(blockNumber) {
        return await this.prisma.transaction.findMany({
            where: {
                Block: {
                    number: blockNumber 
                }
            },
            orderBy: {
                index: 'asc'
            }
        });
    }

    async createTransaction(params) {
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