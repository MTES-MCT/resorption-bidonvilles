const randomStr = global.generate('string');
const commonInputs = require('#fixtures/common.fixtures')(randomStr);

module.exports = {
    findAll: {
        inputs: commonInputs,
        output: [
            {
                id: 1,
                label: 'Ressortissants français',
            },
            {
                id: 2,
                label: 'Ressortissants européens',
            },
        ],
    },
};
