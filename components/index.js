const Queue = require('../classes/queue.js');
const Pair = require('./pair.js');

class Component {
    constructor(node, prisma) {
        this.queue = new Queue();
        this.pair = new Pair(node, prisma, this.queue);
    }
}

module.exports = Component;