const query = require('./_common/query');

module.exports = user => query(
    [
        {
            actors: {
                query: 'shantytown_actors.fk_user', operator: '=', value: user.id,
            },
        },
        {
            closed_at: { value: null },
        },
    ],
    undefined, // order
    user,
    'list',
);
