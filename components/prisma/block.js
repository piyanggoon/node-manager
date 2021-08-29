class Block {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async getBlock(hash) {
        return await this.prisma.block.findFirst({
            where: {
                hash: hash
            }
        });
    }

    async createBlock(params) {
        return await this.prisma.block.create({
            data: params
        });
    }
}

module.exports = Block;