const fs = require('fs');
const path = require('path');

module.exports = (models) => {
    const basename = path.basename(module.filename);
    const middlewares = {};

    // instanciate all middlewares
    fs
        .readdirSync(__dirname)
        .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
        .forEach((file) => {
            /* eslint-disable-next-line */
            middlewares[file.replace('Middleware.js', '')] = require(path.join(__dirname, file))(models);
        });

    return middlewares;
};
