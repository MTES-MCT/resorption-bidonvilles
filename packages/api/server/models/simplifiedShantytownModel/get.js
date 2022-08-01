/* code that works
module.exports = (dep, ids) => {
    const knex = dep;
    return knex
        .column({ id: 'shantytown_id' }, 'name', 'address', { closedAt: 'closed_at' })
        .from('shantytowns')
        .whereIn('shantytown_id', ids);
};
*/


/* code that works
module.exports = (dep, ids) => {
    const knex = dep;
    const query = knex
        .column({ id: 'shantytown_id' }, 'name', 'address', { closedAt: 'closed_at' })
        .from('shantytowns')
        .whereIn('shantytown_id', ids)
        .orderBy('closedAt', 'desc');
    console.log(`query: ${query.toString()}`);
    return query;
};
*/

const serialize = require('./_common/serializeSImplifiedShantytown');

module.exports = (dep, ids) => {
    const knex = dep;
    let towns;
    const query = knex
        .column({ id: 'shantytown_id' }, 'name', 'address', { closedAt: 'closed_at' })
        .from('shantytowns')
        .whereIn('shantytown_id', ids)
        .orderBy('closedAt', 'desc');
    console.log(`query: ${query.toString()}`);
    query.then((rows) => {
        towns = rows.map(row => serialize(row));
        console.log(`towns in model: ${JSON.stringify(towns)}`);
    });
    // return towns; <= does not work
    return query; // <= Works but fields are not formatted
};
