import { Server } from "/../NetscriptDefinitions";

export class Queue<T> {
    private _queue: T[];

    constructor() {
        this._queue = [];
    }

    enqueue(item: T): void {
        this._queue.push(item);
    }

    dequeue(): T | undefined {
        return this._queue.shift();
    }

    peek(): T | undefined {
        return this._queue[0];
    }

    contains(item: T): boolean {
        return this._queue.includes(item);
    }

    isEmtpy(): boolean {
        return (this._queue.length == 0);
    }

    size(): number {
        return this._queue.length;
    }
}

export class Stack<T> {
    private _stack: T[];

    constructor() {
        this._stack = [];
    }
    push(item: T): void {
        this._stack.push(item);
    }
    pop(): T | undefined {
        return this._stack.pop();
    }
    peek(): T | undefined {
        return this._stack[this._stack.length - 1]
    }
    isEmtpy(): boolean {
        return (this._stack.length == 0);
    }
    contains(item: T): boolean {
        return this._stack.includes(item);
    }
    size(): number {
        return this._stack.length;
    }
}

export interface Contract {
    filename: string,
    server: string,
    solved: boolean
}

export interface Port {
    name: string,
    program: string,
    run: { (host: string): void; }
}

export interface HackThresholds {
    server: string,
    threshold: number
}