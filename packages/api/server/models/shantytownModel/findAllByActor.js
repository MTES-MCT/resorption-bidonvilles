const query = require('./_common/query');

module.exports = user => query(
    [
        {
            actors: {
                query: 'shantytown_actors.fk_user', operator: '=', value: user.id,
            },
        },
    ],
    undefined, // order
    user,
    'list',
);
