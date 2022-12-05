import query from './_common/query';

export default user => query(
    user,
    'list',
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
);
