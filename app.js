const Node = require('./classes/node.js');
const Prisma = require('./classes/prisma.js');
const Helper = require('./components/helpers.js');

const Pair = require('./components/pair.js');

const node = new Node();
const prisma = new Prisma();

async function handleBlock(block) {
    //console.log(`blockNumber = ${block.number}`)
    let findBlock = await prisma.block().getBlock(block.hash);
    if (findBlock == null) {
        await prisma.block().createBlock({
            hash: block.hash,
            number: block.number,
            timestamp: Helper.toDate(block.timestamp)
        });
    }
}

async function handleTransaction(block, tx) {
    //console.log(`txHash = ${tx.transactionHash}`)
    let findTransaction = await prisma.transaction().getTransaction(tx.transactionHash);
    if (findTransaction == null) {
        await prisma.transaction().createTransaction({
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
        let pair = await Pair.getPair({
            prisma,
            node,
            hash: mint.address
        });

        if (pair !== null) {
            let sender = node.abi().decodeParameter('address', mint.topics[1]);
            let params = node.abi().decodeParameters(['uint256', 'uint256'], mint.data);
            let token0 = (typeof pair.token0 === 'object' ? pair.token0 : pair.Token0);
            let token1 = (typeof pair.token1 === 'object' ? pair.token1 : pair.Token1);
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