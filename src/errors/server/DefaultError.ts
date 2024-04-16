
class DefaultError extends Error {
    _status: number;

    constructor(status: number, message: string) {
        super(message);
        this._status = status;
    }

    get status() { return this._status; }

    getResponse() {
        return this.message;
    }
}

export default DefaultError;