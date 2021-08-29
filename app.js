const Node = require('./classes/node.js');
const Prisma = require('./classes/prisma.js');
const Helper = require('./components/helpers.js');
const Pair = require('./components/pair.js');

const node = new Node();
const prisma = new Prisma();
const pairComp = new Pair(node, prisma);

async function handleBlock(block) {
    //console.log(`blockNumber = ${block.number}`)
    let findBlock = await prisma.block.get(block.hash);
    if (findBlock == null) {
        await prisma.block.create({
            hash: block.hash,
            number: block.number,
            timestamp: Helper.toDate(block.timestamp)
        });
    }
}

async function handleTransaction(block, tx) {
    //console.log(`txHash = ${tx.transactionHash}`)
    let findTransaction = await prisma.transaction.get(tx.transactionHash);
    if (findTransaction == null) {
        await prisma.transaction.create({
            hash: tx.transactionHash,
            index: tx.transactionIndex,
            blockNumber: block.number,
            timestamp: Helper.toDate(block.timestamp)
        });
    }
}

async function handleMint(block, tx, mints) {
    //console.log(`Mints = ${mints.length}`)
    for (let mint of mints) {
        let pair = await pairComp.get(mint.address);
        if (pair !== null) {
            let sender = node.abi.decodeParameter('address', mint.topics[1]);
            let params = node.abi.decodeParameters(['uint256', 'uint256'], mint.data);
            let token0 = (typeof pair.token0 === 'object' ? pair.token0 : pair.Token0);
            let token1 = (typeof pair.token1 === 'object' ? pair.token1 : pair.Token1);

            // find first ?
            await prisma.mint.create({
                txHash: tx.transactionHash,
                pairHash: pair.hash,
                sender: sender,
                amount0: params[0],
                amount1: params[1]
            });

            console.log(`[${token0.symbol}/${token1.symbol}] Mint ${Helper.toEther(params[0])} ${token0.symbol} And ${Helper.toEther(params[1])} ${token1.symbol}`)
        }
    }
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
        //handleBurn,
        //handleSwap
    });
}

main().catch((err) => {
    throw err;
}).finally(async () => {
    prisma.disconnect();
});