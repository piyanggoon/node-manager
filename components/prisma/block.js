class Block {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async get(hash) {
        return await this.prisma.block.findFirst({
            where: {
                hash: hash
            }
        });
    }

    async create(params) {
        return await this.prisma.block.create({
            data: params
        });
    }
}

module.exports = Block;