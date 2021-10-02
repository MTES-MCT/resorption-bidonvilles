const fs = require('fs');
const path = require('path');

module.exports = (database) => {
    const basename = path.basename(module.filename);

    return fs.readdirSync(__dirname)
        .filter(file => (file.indexOf('.') === -1) && (file !== basename) && (file.slice(-5) === 'Model'))
        .reduce((models, file) => {
            const indexPath = path.join(__dirname, file, 'index.js');
            if (fs.existsSync(indexPath)) {
                return {
                    ...models,
                    /* eslint-disable-next-line */
                    [file.replace('Model', '')]: require(indexPath)(database)
                };
            }

            return models;
        }, {});
};
