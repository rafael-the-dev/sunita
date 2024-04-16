import DefaultError from "./DefaultError";

class LoginError extends DefaultError {
    constructor() {
        super(401, "Username or password invalid");
    }
}

export default LoginError;