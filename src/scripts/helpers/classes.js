
export class Queue {
    constructor() {
        this.queue = [];
    }

    enqueue(item) {
        return this.queue.push(item);
    }

    dequeue() {
        return this.queue.shift();
    }

    peek() {
        return this.queue[0];
    }

    contains(item) {
        return this.queue.includes(item);
    }

    isEmtpy() {
        return (this.queue.length == 0);
    }

    get length() {
        return this.queue.length;
    }
}

export class Stack {
    constructor() {
        this.stack = [];
    }

    push(item) {
        return this.stack.push(item);
    }
    pop(item) {
        return this.stack.pop();
    }
    peek() {
        return this.stack[this.stack.length] 
    }
    isEmtpy() {
        return (this.stack.length == 0);
    }

    size() {
        return this.stack.length;
    }
}