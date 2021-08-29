const Node = require('./classes/node.js');
const Prisma = require('./classes/prisma.js');

const node = new Node();
const prisma = new Prisma();

async function handleBlock(block) {
    console.log(`blockNumber = ${block.number}`)
}

async function handleTransaction(block, tx) {
    console.log(`txHash = ${tx.transactionHash}`)
}

async function handleMint(block, tx, mints) {
    console.log(`Mints = ${mints.length}`)
}

async function handleBurn(block, tx, burns) {
    console.log(`Burns = ${burns.length}`)
}

async function handleSwap(block, tx, swaps) {
    console.log(`Swaps = ${swaps.length}`)
}

async function main() {
    node.init({
        handleBlock,
        handleTransaction,
        handleMint,
        handleBurn,
        handleSwap
    });
}

main().catch((err) => {
    throw err;
}).finally(async () => {
    prisma.disconnect();
});