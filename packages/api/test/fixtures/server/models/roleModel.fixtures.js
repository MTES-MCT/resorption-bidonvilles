const randomStr = global.generate('string');
const commonInputs = require('#fixtures/common.fixtures')(randomStr);

module.exports = {
    findAll: {
        inputs: commonInputs,
        output: [
            {
                id: 1,
                name: 'superadmin',
            },
            {
                id: 2,
                name: 'admin',
            },
        ],
    },

    findOne: {
        inputs: commonInputs,
        output: {
            id: 1,
            name: 'superadmin',
        },
    },
};
