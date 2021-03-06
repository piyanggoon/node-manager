const { PrismaClient } = require('@prisma/client');
const Block = require('../components/prisma/block.js');
const Transaction = require('../components/prisma/transaction.js');
const Token = require('../components/prisma/token.js');
const Pair = require('../components/prisma/pair.js');
const Mint = require('../components/prisma/mint.js');
const Burn = require('../components/prisma/burn.js');
const Sync = require('../components/prisma/sync.js');
const Swap = require('../components/prisma/swap.js');
const Reserves = require('../components/prisma/reserves.js');

class Prisma {
    constructor() {
        this.prisma = new PrismaClient();
        this.block = new Block(this.prisma);
        this.transaction = new Transaction(this.prisma);
        this.token = new Token(this.prisma);
        this.pair = new Pair(this.prisma);
        this.mint = new Mint(this.prisma);
        this.burn = new Burn(this.prisma);
        this.sync = new Sync(this.prisma);
        this.swap = new Swap(this.prisma);
        this.reserves = new Reserves(this.prisma);
    }

    async disconnect() {
        await this.prisma.$disconnect();
    }
}

module.exports = Prisma;