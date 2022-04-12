const shantytownModel = require('#server/models/shantytownModel');


module.exports = async (user) => {
    const shantytowns = await shantytownModel.findAll(user, [], 'list');
    return shantytowns;
};
