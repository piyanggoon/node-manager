const Node = require('./classes/node.js');
const Prisma = require('./classes/prisma.js');

const node = new Node();
const prisma = new Prisma();

async function handleBlock(block) {
    console.log(block)
    throw 'test';
}

async function main() {
    node.handleBlock = handleBlock;
    node.start();
}

main().catch((err) => {
    throw err;
}).finally(async () => {
    prisma.disconnect();
});