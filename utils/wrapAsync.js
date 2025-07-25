module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}

// used because express doesn't handle async errors by default
// This utility wraps async functions to catch errors and pass them to the next middleware
// This allows for cleaner error handling in Express applications