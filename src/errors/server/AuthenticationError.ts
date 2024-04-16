import DefaultError from "./DefaultError";

class AuthorizationError extends DefaultError {
    constructor(message = "Invalid credentials") {
        super(401, message);
    }
}

export default AuthorizationError;