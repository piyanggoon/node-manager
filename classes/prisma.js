const { PrismaClient } = require('@prisma/client');

class Prisma {
    constructor() {
        this.prisma = new PrismaClient();
    }

    async disconnect() {
        await this.prisma.$disconnect();
    }
}

module.exports = Prisma;