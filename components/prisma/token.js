class Token {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async get(hash) {
        return await this.prisma.token.findUnique({
            where: {
                hash: hash
            }
        });
    }

    async create(params) {
        return await this.prisma.token.create({
            data: {
                hash: params.hash,
                name: params.name,
                symbol: params.symbol
            }
        });
    }
}

module.exports = Token;