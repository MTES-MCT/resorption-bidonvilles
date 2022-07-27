const findByIds = require('./findByIds');

module.exports = async (id) => {
    const result = await findByIds([id]);
    return result.length === 1 ? result[0] : null;
};
