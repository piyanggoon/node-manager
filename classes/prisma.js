const { PrismaClient } = require('@prisma/client');
const Block = require('../components/prisma/block.js');
const Transaction = require('../components/prisma/transaction.js');
const Token = require('../components/prisma/token.js');
const Pair = require('../components/prisma/pair.js');

class Prisma {
    constructor() {
        this.prisma = new PrismaClient();

        this.block_ = new Block(this.prisma);
        this.transaction_ = new Transaction(this.prisma);
        this.token_ = new Token(this.prisma);
        this.pair_ = new Pair(this.prisma);
    }

    async disconnect() {
        await this.prisma.$disconnect();
    }

    block() {
        return this.block_;
    }

    transaction() {
        return this.transaction_;
    }

    token() {
        return this.token_;
    }

    pair() {
        return this.pair_;
    }
}

module.exports = Prisma;