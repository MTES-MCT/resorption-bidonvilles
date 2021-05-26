const randomStr = global.generate('string');
const commonInputs = require('#fixtures/common.fixtures')(randomStr);

module.exports = {
    findAll: {
        inputs: commonInputs,
        output: [
            {
                id: 1,
                label: 'Inconnu',
                color: '#cccccc',
            },
            {
                id: 2,
                label: 'Immeuble bâti',
                color: '#cccccc',
            },
        ],
    },
};
