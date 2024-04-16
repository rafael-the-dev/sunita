import DefaultError from "./DefaultError";

class Error404 extends DefaultError {
    constructor(message = "404 Error") {
        super(404, message);
    }
}

export default Error404;