export class Link<T> {
    private _before: Link<T>;
    private _next: Link<T>;
    private _value: T;
    constructor(value: T) {
        this._value = value;
    }

    public get value() {
        return this._value;
    }

    public get before() {
        return this._before.value;
    }

    public get next() {
        return this._next.value;
    }

    public get beforeLink() {
        return this._before;
    }

    public get nextLink() {
        return this._next;
    }

    public set beforeLink(link: Link<T>) {
        this._before = link;
        if (!link) {
            return;
        }
        if (link.nextLink === this) {
            return;
        }
        link.nextLink = this;
    }

    public set nextLink(link: Link<T>) {
        this._next = link;
        if (!link) {
            return;
        }
        if (link.nextLink === this) {
            return;
        }
        link.beforeLink = this;
    }

    public set before(before: T) {
        const newLink = new Link<T>(before);
        newLink.nextLink = this;
    }

    public set next(next: T) {
        const newLink = new Link<T>(next);
        newLink.beforeLink = this;
    }

    public destroy() {
        if (this._before) {
            this._before.nextLink = this._next;
        }
        if (this._next) {
            this._next.beforeLink = this._before;
        }
        this._value = null;
        this._before = undefined;
        this._next = undefined;
    }
}