const Net = require('net');
const Web3 = require('web3');
const Config = require('../config.json');
const Polling = require('./polling.js');
const Helpers = require('../components/helpers.js');

const IBep20 = require('../resources/abis/IBEP20.json');
const IPair = require('../resources/abis/IPair.json');

class Node {
    constructor() {
        this.web3_ = new Web3(new Web3.providers.IpcProvider(Config.geth.url, Net));
        this.polling = new Polling();

        this.handleBlock = async (block) => {};
        this.handleTransaction = async (block, tx) => {};
        this.handleMint = async (block, tx, mints) => {};
        this.handleBurn = async (block, tx, burns) => {};
        this.handleSwap = async (block, tx, swaps) => {};

        this.web3 = this.web3_.eth;
        this.abi = this.web3.abi;
    }

    async init(params = {}) {
        let self = this;

        for (let k in params) {
            if (Helpers.isFunc(params[k])) {
                self[k] = params[k];
            }
        }

        let lastBlock = this.polling.lastBlock();
        let currentBlock = this.polling.currentBlock();
        if (lastBlock == 0 || currentBlock == lastBlock) {
            this.polling.syncBlock(await this.web3.getBlockNumber());
        }
        
        this.polling.start(async () => {
            let currentBlock = self.polling.currentBlock();
            let block = await self.web3.getBlock(currentBlock);

            await self.handleBlock(block);

            let mint = Helpers.keccak256('Mint(address,uint256,uint256)');
            let burn = Helpers.keccak256('Burn(address,uint256,uint256,address)');
            let swap = Helpers.keccak256('Swap(address,uint256,uint256,uint256,uint256,address)');
            for (let txHash of block.transactions) {
                let tx = await self.web3.getTransactionReceipt(txHash);
                if (tx && tx.status == true && tx.logs.length > 0) {
                    let mints = tx.logs.filter((x) => x.topics[0] == mint);
                    let burns = tx.logs.filter((x) => x.topics[0] == burn);
                    let swaps = tx.logs.filter((x) => x.topics[0] == swap);

                    if (mints.length > 0 || burns.length > 0 || swaps.length > 0) {
                        await self.handleTransaction(block, tx);
                        if (mints.length > 0) await self.handleMint(block, tx, mints);
                        if (burns.length > 0) await self.handleBurn(block, tx, burns);
                        if (swaps.length > 0) await self.handleSwap(block, tx, swaps);
                    }
                }
            }

            self.polling.syncBlock(await self.web3.getBlockNumber());
        });
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

    async getPair(hash) {
        let result = null;
        let pair = this.contract(IPair, hash);
        try {
            let token0 = await pair.methods.token0().call();
                token0 = await this.getToken(token0);
            let token1 = await pair.methods.token1().call();
                token1 = await this.getToken(token1);

            if (token0 !== null && token1 !== null) {
                result = {
                    hash: hash,
                    factory: await pair.methods.factory().call(),
                    token0: token0,
                    token1: token1
                };
            }
        } catch (err) {
            // empty
        }
        return result;
    }
}

module.exports = Node;