const { sequelize } = require('#db/models');

/**
 * List of entities
 *
 * @type {Array.<String>|Null}
 */
let entities = null;

/**
 * Fetches the list of entities registered into database
 *
 * @returns {Array.<String>}
 */
module.exports = async () => {
    if (entities !== null) {
        return entities;
    }

    const rows = await sequelize.query('SELECT name FROM entities', {
        type: sequelize.QueryTypes.SELECT,
    });

    entities = rows.map(({ name }) => name);
    return entities;
};
