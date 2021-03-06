const Net = require('net');
const Web3 = require('web3');
const Polling = require('./polling.js');
const Helpers = require('../components/helpers.js');
const Config = require('../config.json');

const IBep20 = require('../resources/abis/IBEP20.json');
const IPair = require('../resources/abis/IPair.json');

class Node {
    constructor() {
        this.web3_ = new Web3(new Web3.providers.IpcProvider(Config.geth.url, Net));
        this.polling = new Polling(Config.polling.interval);
        this.web3 = this.web3_.eth;
        this.abi = this.web3.abi;

        this.handleBlock = async (block) => {};
        this.handleTransaction = async (block, tx) => {};
        this.handleMint = async (block, tx, mints) => {};
        this.handleBurn = async (block, tx, burns) => {};
        this.handleSwap = async (block, tx, swaps) => {};
        this.handleSync = async (block, tx, syncs) => {};
        this.handleReserves = async (block, pairs) => {};
        this.outOfMemory = async () => {};
    }

    async init(params = {}) {
        let self = this;

        for (let k in params) {
            if (Helpers.isFunc(params[k])) {
                self[k] = params[k];
            }
        }

        if (self.polling.lastBlock() == self.polling.currentBlock()) {
            self.polling.syncBlock(await self.web3.getBlockNumber());
        }
        
        self.polling.start(async (blockNumber) => {
            let block = await self.web3.getBlock(blockNumber);

            await self.handleBlock(block);
            
            let pairs = [];
            if (block.transactions.length > 0) {
                let func = async (txHashs) => {
                    for (let txHash of txHashs) {
                        let tx = await self.web3.getTransactionReceipt(txHash);
                        if (tx && tx.status && tx.logs.length > 0) {
                            let mints = tx.logs.filter((x) => x.topics[0] == '0x4c209b5fc8ad50758f13e2e1088ba56a560dff690a1c6fef26394f4c03821c4f');
                            let burns = tx.logs.filter((x) => x.topics[0] == '0xdccd412f0b1252819cb1fd330b93224ca42612892bb3f4f789976e6d81936496');
                            let syncs = tx.logs.filter((x) => x.topics[0] == '0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1');
                            let swaps = tx.logs.filter((x) => x.topics[0] == '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822');
        
                            if (mints.length > 0 || burns.length > 0 || syncs.length > 0 || swaps.length > 0) {
                                await self.handleTransaction(block, tx);
        
                                if (mints.length > 0) await self.handleMint(block, tx, mints);
                                if (burns.length > 0) await self.handleBurn(block, tx, burns);
                                if (syncs.length > 0) await self.handleSync(block, tx, syncs);
                                if (swaps.length > 0) await self.handleSwap(block, tx, swaps);
        
                                for (let event of [mints, burns, syncs, swaps]) {
                                    for (let x of event) {
                                        if (!pairs.includes(x.address)) {
                                            pairs.push(x.address);
                                        }
                                    }
                                }
                            }
                        }
                    }
                };

                let promises = [];
                let length = Math.ceil(block.transactions.length / 8);
                let splitTx = Helpers.arraySplit(block.transactions, length);
                for (let txHashs of splitTx) {
                    promises.push(func(txHashs));
                }
                await Promise.all(promises);
            }

            if (pairs.length > 0) {
                await self.handleReserves(block, pairs);
            }
        }, Config.polling.step, self.outOfMemory);
    }

    contract(json, hash) {
        return new this.web3.Contract(json, hash);
    }
    
    async getToken(hash) {
        let result = null;
        let token = this.contract(IBep20, hash);
        try {
            result = {
                hash: hash,
                name: await token.methods.name().call(),
                symbol: await token.methods.symbol().call()
            };
        } catch (err) {
            // empty
        }
        return result;
    }

    async getFactory(pair) {
        let result = '-';
        try {
            result = await pair.methods.factory().call();
        } catch (err) {
            try {
                result = await pair.methods.FACTORY().call();
            } catch (err) {
                // empty
            }
        }
        return result;
    }

    async getPair(hash) {
        let result = null;
        let pair = this.contract(IPair, hash);
        try {
            let token0 = await pair.methods.token0().call();
                token0 = await this.getToken(token0);
            let token1 = await pair.methods.token1().call();
                token1 = await this.getToken(token1);

            if (token0 && token1) {
                result = {
                    hash: hash,
                    factory: await this.getFactory(pair),
                    token0: token0,
                    token1: token1
                };
            }
        } catch (err) {
            // empty
        }
        return result;
    }

    async getReserves(hash, blockNumber) {
        let result = null;
        let pair = this.contract(IPair, hash);
        try {
            let reserves = await pair.methods.getReserves().call({
                defaultBlock: blockNumber
            });

            result = {
                reserve0: reserves[0],
                reserve1: reserves[1],
                timestamp: Helpers.toDate(reserves[2])
            };
        } catch (err) {
            // empty
        }
        return result;
    }
}

module.exports = Node;