const Node = require('./classes/node.js');
const Prisma = require('./classes/prisma.js');
const Helper = require('./components/helpers.js');
const Pair = require('./components/pair.js');

const node = new Node();
const prisma = new Prisma();
const pairComp = new Pair(node, prisma);

async function handleBlock(block) {
    let findBlock = await prisma.block.get(block.hash);
    if (!findBlock) {
        await prisma.block.create({
            hash: block.hash,
            number: block.number,
            timestamp: Helper.toDate(block.timestamp)
        });
    }
}

async function handleTransaction(block, tx) {
    let findTransaction = await prisma.transaction.get(tx.transactionHash);
    if (!findTransaction) {
        await prisma.transaction.create({
            hash: tx.transactionHash,
            index: tx.transactionIndex,
            blockNumber: block.number,
            timestamp: Helper.toDate(block.timestamp)
        });
    }
}

async function handleMint(block, tx, mints) {
    for (let mint of mints) {
        let pair = await pairComp.get(mint.address);
        if (pair) {
            let sender = node.abi.decodeParameter('address', mint.topics[1]);
            let params = node.abi.decodeParameters(['uint256', 'uint256'], mint.data);
            let token0 = (typeof pair.token0 === 'object' ? pair.token0 : pair.Token0);
            let token1 = (typeof pair.token1 === 'object' ? pair.token1 : pair.Token1);

            await prisma.mint.create({
                txHash: tx.transactionHash,
                pairHash: pair.hash,
                index: mint.logIndex,
                sender: sender,
                amount0: params[0],
                amount1: params[1]
            });

            console.log(`[${token0.symbol}/${token1.symbol}] Mint ${Helper.toEther(params[0])} ${token0.symbol} And ${Helper.toEther(params[1])} ${token1.symbol}`)
        }
    }
}

async function handleBurn(block, tx, burns) {
    for (let burn of burns) {
        let pair = await pairComp.get(burn.address);
        if (pair) {
            let sender = node.abi.decodeParameter('address', burn.topics[1]);
            let to = node.abi.decodeParameter('address', burn.topics[2]);
            let params = node.abi.decodeParameters(['uint256', 'uint256'], burn.data);
            let token0 = (typeof pair.token0 === 'object' ? pair.token0 : pair.Token0);
            let token1 = (typeof pair.token1 === 'object' ? pair.token1 : pair.Token1);

            await prisma.burn.create({
                txHash: tx.transactionHash,
                pairHash: pair.hash,
                index: burn.logIndex,
                sender: sender,
                amount0: params[0],
                amount1: params[1],
                to: to
            });

            console.log(`[${token0.symbol}/${token1.symbol}] Burn ${Helper.toEther(params[0])} ${token0.symbol} And ${Helper.toEther(params[1])} ${token1.symbol}`)
        }
    }
}

async function handleSwap(block, tx, swaps) {
    for (let swap of swaps) {
        let pair = await pairComp.get(swap.address);
        if (pair) {
            let sender = node.abi.decodeParameter('address', swap.topics[1]);
            let to = node.abi.decodeParameter('address', swap.topics[2]);
            let params = node.abi.decodeParameters(['uint256', 'uint256', 'uint256', 'uint256'], swap.data);
            let token0 = (typeof pair.token0 === 'object' ? pair.token0 : pair.Token0);
            let token1 = (typeof pair.token1 === 'object' ? pair.token1 : pair.Token1);

            await prisma.swap.create({
                txHash: tx.transactionHash,
                pairHash: pair.hash,
                index: swap.logIndex,
                sender: sender,
                amount0In: params[0],
                amount1In: params[1],
                amount0Out: params[2],
                amount1Out: params[3],
                to: to
            });

            if (Helper.toEther(params[0]) > 0) {
                console.log(`[${token0.symbol}/${token1.symbol}] Swap ${Helper.toEther(params[0])} ${token0.symbol} to ${Helper.toEther(params[3])} ${token1.symbol}`)
            } else if (Helper.toEther(params[1]) > 0) {
                console.log(`[${token0.symbol}/${token1.symbol}] Swap ${Helper.toEther(params[1])} ${token1.symbol} to ${Helper.toEther(params[2])} ${token0.symbol}`)
            }
        }
    }
}

async function handleReserves(block, pairs) {
    for (let hash of pairs) {
        let findPair = await prisma.pair.get(hash);
        if (findPair) {
            let result = await node.getReserves(hash, block.number);
            if (result) {
                await prisma.reserves.create({
                    hash: hash,
                    blockNumber: block.number,
                    reserve0: result.reserve0,
                    reserve1: result.reserve1,
                    timestamp: result.timestamp
                });
            }
        }
    }
}

async function main() {
    node.init({
        handleBlock,
        handleTransaction,
        handleMint,
        handleBurn,
        handleSwap,
        handleReserves
    });
}

main().catch((err) => {
    throw err;
}).finally(async () => {
    prisma.disconnect();
});