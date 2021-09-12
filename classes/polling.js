const fs = require('fs');
const Interval = require('interval-promise')
const Helpers = require('../components/helpers.js');
const Config = require('../config.json');

class Polling {
    constructor(interval = 1000) {
        this.polling = JSON.parse(fs.readFileSync('./polling.json'));
        this.interval = interval;
    }

    start(func, step = 1, outOfMemory) {
        let self = this;
        Interval(async (iteration, stopInterval) => {
            if (Helpers.memoryUsage(Config.memory.limit)) {
                stopInterval();
                outOfMemory();
                return;
            }
            
            try {
                let blockLeft = (self.polling.lastBlock - self.polling.syncBlock);
                    blockLeft = (blockLeft > step ? step : blockLeft);
                if (blockLeft >= 1) {
                    let promises = [];
                    for (let i = 0; i < blockLeft; i++) {
                        promises.push(func(self.polling.syncBlock + i));
                    }
                    await Promise.all(promises);
                    self.polling.syncBlock += step;
                    self.sync();
                }
            } catch(err) {
                console.log(err)
            }
        }, self.interval);
    }

    sync() {
        let json = JSON.stringify(this.polling, null, 2);
        fs.writeFileSync('./polling.json', json);
    }

    syncBlock(number) {
        this.polling.lastBlock = number;
        this.sync();
    }

    lastBlock() {
        return this.polling.lastBlock;
    }

    currentBlock() {
        return this.polling.syncBlock;
    }
}

module.exports = Polling;