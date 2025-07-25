class Express_Error extends Error{
    constructor(statusCode, message){
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = Express_Error;

// This utility wraps async functions to catch errors and pass them to the next middleware
// When you throw a regular Error, it doesn’t carry HTTP-specific information like status code.
// Instead, you can use this custom error class to provide both a status code and a message.
// This allows for cleaner error handling in Express applications