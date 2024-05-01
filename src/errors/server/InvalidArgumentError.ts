import DefaultError from "./DefaultError";

class InvalidArgumentError extends DefaultError {
    constructor(message: string) {
        super(400, message ?? "Invalid arguments.");
    }
}

export default InvalidArgumentError;