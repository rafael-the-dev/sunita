const DefaultError = require("./DefaultError");

class AuthorizationError extends DefaultError {
    constructor(message) {
        super(401, message ?? "Invalid credentials");
    }
}

module.exports = AuthorizationError;