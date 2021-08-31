const fs = require('fs');
const Interval = require('interval-promise')

class Polling {
    constructor(interval = 1000) {
        let file = fs.readFileSync('./polling.json');
        this.polling = JSON.parse(file);
        this.interval = interval;
        this.stop = false;
    }

    start(func) {
        let self = this;
        Interval(async (iteration, stop) => {
            if (self.stop) {
                return stop();
            }
            
            try {
                if (self.polling.syncBlock < self.polling.lastBlock) {
                    await func();
                    self.nextBlock();
                }
            } catch(err) {
                console.log(err)
            }
        }, self.interval);
    }

    stop() {
        this.stop = true;
    }

    lastBlock() {
        return this.polling.lastBlock;
    }

    currentBlock() {
        return this.polling.syncBlock;
    }

    syncBlock(number) {
        this.polling.lastBlock = number;
        this.sync();
    }

    nextBlock() {
        this.polling.syncBlock++;
        this.sync();
    }

    sync() {
        let json = JSON.stringify(this.polling, null, 2);
        fs.writeFileSync('./polling.json', json);
    }
}

module.exports = Polling;