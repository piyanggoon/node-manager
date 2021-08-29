const Net = require('net');
const Web3 = require('web3');
const Config = require('../config.json');
const Polling = require('./polling.js');

class Node {
    constructor() {
        this.web3_ = new Web3(new Web3.providers.IpcProvider(Config.geth.url, Net));
        this.polling = new Polling();

        this.handleBlock = async (block) => {};
    }

    web3() {
        return this.web3_.eth;
    }

    async start(func = {}) {
        let self = this;
        let lastBlock = this.polling.lastBlock();
        let currentBlock = this.polling.currentBlock();
        if (lastBlock == 0 || currentBlock == lastBlock) {
            this.polling.syncBlock(await this.web3().getBlockNumber());
        }
        
        this.polling.start(async () => {
            let currentBlock = self.polling.currentBlock();
            let block = await self.web3().getBlock(currentBlock);
            
            await self.handleBlock(block);

            self.polling.syncBlock(await self.web3().getBlockNumber());
        });
    }
}

module.exports = Node;