const fs = require('fs');
const Interval = require('interval-promise')

class Polling {
    constructor(interval = 1000) {
        let file = fs.readFileSync('./polling.json');
        this.polling = JSON.parse(file);
        this.interval = interval;
        this.stop = false;
    }

    start(func, step = 1) {
        let self = this;
        Interval(async (iteration, stop) => {
            if (self.stop) {
                return stop();
            }
            
            try {
                let promises = [];
                let blockLeft = (self.polling.lastBlock - self.polling.syncBlock);
                    blockLeft = (blockLeft > step ? step : blockLeft);
                if (blockLeft >= 1) {
                    for (let i = 0; i < blockLeft; i++) {
                        promises.push(func(self.polling.syncBlock++));
                    }
                    await Promise.all(promises);
                    self.sync();
                }
            } catch(err) {
                console.log(err)
            }
        }, self.interval);
    }

    stop() {
        this.stop = true;
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