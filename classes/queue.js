class Queue {
    constructor(maxPending = 1) {
        this.maxPending = maxPending;
        this.pending = [];
        this.queue = [];
    }

    add(func, args, group = 'default') {
        return new Promise((resolve, reject) => {
            if (typeof this.pending[group] == 'undefined') {
                this.pending[group] = 0;
            }

            if (typeof this.queue[group] == 'undefined') {
                this.queue[group] = [];
            }

            this.queue[group].push({
                func: func,
                args: args,
                resolve: resolve,
                reject: reject
            });

            this.processQueue(group);
        });
    }

    processQueue(group) {
        if(this.pending[group] >= this.maxPending) {
            return;
        }

        let queue = this.queue[group].shift();
        if(!queue) {
            this.clearQueue(group);
            return;
        }

        this.pending[group]++;

        queue.func.apply(null, queue.args).then((res) => {
            queue.resolve(res);
            this.nextQueue(group);
        }).catch((err) => {
            queue.reject(err);
            this.nextQueue(group);
        });
    }

    clearQueue(group) {
        this.pending[group] = 0;
        this.queue[group] = [];
    }

    nextQueue(group) {
        this.pending[group]--;
        this.processQueue(group);
    }
}

module.exports = Queue;