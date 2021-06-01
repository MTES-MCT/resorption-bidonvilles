const randomStr = global.generate('string');
const commonInputs = require('#fixtures/common.fixtures')(randomStr);

module.exports = {
    findAll: {
        inputs: commonInputs,
        output: [
            {
                code: '75',
                name: 'Paris',
            },
        ],
    },

    findOne: {
        inputs: commonInputs,
        output: {
            code: '75',
            name: 'Paris',
        },
    },
};
