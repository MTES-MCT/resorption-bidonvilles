const query = require('./_common/query');

module.exports = user => query(
    [
        {
            actors: {
                query: 'shantytown_actors.fk_user', operator: '=', value: user.id,
            },
        },
        {
            is_closed: {
                query: 'shantytowns.closed_at', not: false, value: null,
            },
        },
    ],
    undefined, // order
    user,
    'list',
);
