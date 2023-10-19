
export class Queue {
    constructor() {
        this.items = [];
    }

    enqueue(item) {
        return this.items.push(item);
    }

    dequeue() {
        return this.items.shift();
    }

    peek() {
        return this.items[0];
    }

    contains(item) {
        return this.items.includes(item);
    }

    isEmtpy() {
        return (this.items.length == 0);
    }

    get length() {
        return this.items.length;
    }
}