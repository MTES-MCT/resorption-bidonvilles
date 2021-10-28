const fs = require('fs');
const path = require('path');

module.exports = (database) => {
    const basename = path.basename(module.filename);

    return fs.readdirSync(__dirname)
        .filter(file => (file.indexOf('.') === -1) && (file !== basename) && (file.slice(-5) === 'Model'))
        .reduce((models, file) => {
            const indexPath = path.join(__dirname, file, 'index.js');
            if (fs.existsSync(indexPath)) {
                /* eslint-disable-next-line */
                const exp = require(indexPath);

                if (typeof exp === 'function') {
                    return {
                        ...models,
                        [file.replace('Model', '')]: exp(database),
                    };
                }
            }

            return models;
        }, {});
};
