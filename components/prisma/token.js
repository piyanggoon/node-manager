class Token {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async getToken(hash) {
        return await this.prisma.token.findFirst({
            where: {
                hash: hash
            }
        });
    }

    async createToken(params) {
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