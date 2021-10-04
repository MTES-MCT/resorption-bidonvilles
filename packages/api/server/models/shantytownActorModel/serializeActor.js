module.exports = (actor) => {
    const themes = [
        ...actor.themes.map(id => ({
            id,
        })),
    ];

    if (actor.autre !== null) {
        themes.push({
            id: 'autre',
            value: actor.autre,
        });
    }

    return {
        id: actor.userId,
        first_name: actor.userFirstName,
        last_name: actor.userLastName,
        organization: {
            id: actor.organizationId,
            name: actor.organizationAbbreviation || actor.organizationName,
        },
        themes,
    };
};
