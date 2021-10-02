/**
 * Serializes a single actor row
 *
 * @param {Object} actor
 *
 * @returns {Object}
 */
function serializeActor(actor) {
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
}

/**
 * Processes an array of themes to make it ready for database insertion
 *
 * @param {Array.<Object>} themes Each object has the property "id", and for the special case "autre" a property "value"
 *
 * @returns {Object} A key-value object with a key "themes" (array of theme ids) and a key "autre" (string or null)
 */
function processThemes(themes) {
    return themes.reduce((acc, theme) => {
        if (theme.id === 'autre') {
            return {
                ...acc,
                autre: theme.value,
            };
        }

        return {
            ...acc,
            themes: [
                ...acc.themes,
                theme.id,
            ],
        };
    }, {
        themes: [],
        autre: null,
    });
}

module.exports = database => ({
    serializeActor,

    findAll(shantytownIds, transaction = undefined) {
        const ids = Array.isArray(shantytownIds) ? shantytownIds : [shantytownIds];

        return database.query(
            `SELECT
                sa.fk_shantytown AS "shantytownId",
                sa.themes,
                sa.autre,
                u.user_id AS "userId",
                u.first_name AS "userFirstName",
                u.last_name AS "userLastName",
                o.organization_id AS "organizationId",
                o.name AS "organizationName",
                o.abbreviation AS "organizationAbbreviation"
            FROM
                shantytown_actors sa
            LEFT JOIN users u ON sa.fk_user = u.user_id
            LEFT JOIN organizations o ON u.fk_organization = o.organization_id
            WHERE sa.fk_shantytown IN (:ids) AND u.fk_status = 'active'
            ORDER BY sa.fk_shantytown ASC, u.first_name ASC`,
            {
                type: database.QueryTypes.SELECT,
                replacements: {
                    ids,
                },
                transaction,
            },
        );
    },

    addActor(shantytownId, userId, themes, createdBy, transaction = undefined) {
        const replacements = {
            ...processThemes(themes),
            fk_shantytown: shantytownId,
            fk_user: userId,
            created_by: createdBy,
        };

        return database.query(
            `INSERT INTO shantytown_actors
                (
                    fk_shantytown,
                    fk_user,
                    themes,
                    autre,
                    created_by
                )
            VALUES (
                :fk_shantytown,
                :fk_user,
                ARRAY[${replacements.themes.map(id => `'${id}'`).join(',')}]::enum_shantytown_actors_themes[],
                :autre,
                :created_by
            )`, {
                replacements,
                transaction,
            },
        );
    },

    removeActor(shantytownId, userId, transaction = undefined) {
        return database.query(
            `DELETE
                FROM shantytown_actors
                WHERE fk_shantytown = :fk_shantytown AND fk_user = :fk_user`,
            {
                replacements: {
                    fk_shantytown: shantytownId,
                    fk_user: userId,
                },
                transaction,
            },
        );
    },

    updateThemes(shantytownId, userId, themes, updatedBy, transaction = undefined) {
        const replacements = {
            ...processThemes(themes),
            fk_shantytown: shantytownId,
            fk_user: userId,
            updated_by: updatedBy,
        };

        return database.query(
            `UPDATE shantytown_actors
                SET
                    themes = ARRAY[${replacements.themes.map(id => `'${id}'`).join(',')}]::enum_shantytown_actors_themes[],
                    autre = :autre,
                    updated_by = :updated_by
                WHERE fk_shantytown = :fk_shantytown AND fk_user = :fk_user`,
            {
                replacements,
                transaction,
            },
        );
    },

    removeTheme(shantytownId, userId, themeId, updatedBy, transaction = undefined) {
        let query;
        if (themeId === 'autre') {
            query = 'autre = null';
        } else {
            query = 'themes = array_remove(themes, :themeId)';
        }

        return database.query(
            `UPDATE shantytown_actors
                SET
                    ${query},
                    updated_by = :updated_by
                WHERE fk_shantytown = :fk_shantytown AND fk_user = :fk_user`,
            {
                replacements: {
                    themeId,
                    fk_shantytown: shantytownId,
                    fk_user: userId,
                    updated_by: updatedBy,
                },
                transaction,
            },
        );
    },
});
