exports.getPair = async function(params) {
    let prisma = params.prisma;
    let node = params.node;
    let hash = params.hash;

    let findPair = await prisma.pair().getPair(hash);
    if (findPair == null) {
        let pair = await node.getPair(hash);
        if (pair !== null) {
            let token0 = await prisma.token().getToken(pair.token0.hash);
            if (token0 == null) {
                await prisma.token().createToken({
                    hash: pair.token0.hash,
                    name: pair.token0.name,
                    symbol: pair.token0.symbol
                });
            }

            let token1 = await prisma.token().getToken(pair.token1.hash);
            if (token1 == null) {
                await prisma.token().createToken({
                    hash: pair.token1.hash,
                    name: pair.token1.name,
                    symbol: pair.token1.symbol
                });
            }

            await prisma.pair().createPair({
                hash: hash,
                factory: pair.factory,
                token0: {
                    hash: pair.token0.hash
                },
                token1: {
                    hash: pair.token1.hash
                }
            });

            return pair;
        }
    }
    return findPair;
};