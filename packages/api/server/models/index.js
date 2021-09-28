const fs = require('fs');
const path = require('path');

module.exports = (database) => {
    const basename = path.basename(module.filename);
    const models = {};

    const files = fs.readdirSync(__dirname);
    files
        .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
        .forEach((file) => {
            /* eslint-disable-next-line */
            models[file.replace('Model.js', '')] = require(path.join(__dirname, file))(database);
        });
    files
        .filter(file => (file.indexOf('.') === -1) && (file !== basename) && (file.slice(-5) === 'Model'))
        .forEach((file) => {
            const indexPath = path.join(__dirname, file, 'index.js');
            if (fs.existsSync(indexPath)) {
                /* eslint-disable-next-line */
                models[file.replace('Model', '')] = require(indexPath)(database);
            }
        });

    return models;
};
