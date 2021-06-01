const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

/**
 * @param {Function} fn An express callback (hence it's supposed to receive req, res, and next)
 *
 * @returns {Function} An express callback that encapsulates the original one around a Promise
 */
function asyncHandler(fn) {
    if (typeof fn !== 'function') {
        return fn;
    }

    return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

/**
 * Enriches the given express app with asynchronous-friendly methods
 *
 * Basically, we rewrite every express method (get, post, etc.) so that they support async callbacks.
 * That way, we can properly catch unhandled failing promises.
 * Please @see loggerLoader if you want to see the default behavior provided for these unhandled
 * promises.
 *
 * @returns {Express} An express app with enriched methods
 */
function asyncExpress() {
    const app = express();

    const methods = ['get', 'post', 'put', 'delete'];
    methods.forEach((methodName) => {
        const originalMethod = app[methodName];
        app[methodName] = (...args) => {
            if (args.length <= 1) {
                return originalMethod.call(app, ...args);
            }

            const [path, ...callbacks] = args;
            return originalMethod.call(app, path, ...callbacks.map(cb => asyncHandler(cb)));
        };
    });

    return app;
}

module.exports = () => {
    const app = asyncExpress();
    app.use(cors());
    app.use(bodyParser.json());

    return app;
};
