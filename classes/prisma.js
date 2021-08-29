const { PrismaClient } = require('@prisma/client');
const Block = require('../components/prisma/block.js');
const Transaction = require('../components/prisma/transaction.js');
const Token = require('../components/prisma/token.js');
const Pair = require('../components/prisma/pair.js');
const Mint = require('../components/prisma/mint.js');

class Prisma {
    constructor() {
        this.prisma = new PrismaClient();

        this.block = new Block(this.prisma);
        this.transaction = new Transaction(this.prisma);
        this.token = new Token(this.prisma);
        this.pair = new Pair(this.prisma);
        this.mint = new Mint(this.prisma);
    }

    async disconnect() {
        await this.prisma.$disconnect();
    }
}

module.exports = Prisma;