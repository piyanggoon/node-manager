const Net = require('net');
const Web3 = require('web3');
const Config = require('../config.json');
const Polling = require('./polling.js');
const Helpers = require('../components/helpers.js');

class Node {
    constructor() {
        this.web3_ = new Web3(new Web3.providers.IpcProvider(Config.geth.url, Net));
        this.polling = new Polling();

        this.handleBlock = async (block) => {};
        this.handleTransaction = async (block, tx) => {};
        this.handleMint = async (block, tx, mints) => {};
        this.handleBurn = async (block, tx, burns) => {};
        this.handleSwap = async (block, tx, swaps) => {};
    }

    web3() {
        return this.web3_.eth;
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
            this.polling.syncBlock(await this.web3().getBlockNumber());
        }
        
        this.polling.start(async () => {
            let currentBlock = self.polling.currentBlock();
            let block = await self.web3().getBlock(currentBlock);

            await self.handleBlock(block);

            let mint = Helpers.keccak256('Mint(address,uint256,uint256)');
            let burn = Helpers.keccak256('Burn(address,uint256,uint256,address)');
            let swap = Helpers.keccak256('Swap(address,uint256,uint256,uint256,uint256,address)');
            for (let txHash of block.transactions) {
                let tx = await self.web3().getTransactionReceipt(txHash);
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

            self.polling.syncBlock(await self.web3().getBlockNumber());
        });
    }
}

module.exports = Node;