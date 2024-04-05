import { sequelize } from '#db/sequelize';

export default async (userId, values, transaction = undefined) => {
    if (userId === undefined) {
        throw new Error('The user id is missing');
    }

    const allowedProperties = [
        'first_name', 'last_name', 'position', 'phone', 'password', 'fk_status',
        'last_version', 'last_changelog', 'charte_engagement_signee', 'last_access',
        'admin_comments', 'fk_role_regular', 'expertise_topics_chosen', 'expertise_comment', 'password_conformity',
    ];
    const propertiesToColumns = {
        first_name: 'first_name',
        last_name: 'last_name',
        position: 'position',
        phone: 'phone',
        password: 'password',
        fk_status: 'fk_status',
        last_version: 'last_version',
        last_changelog: 'last_changelog',
        charte_engagement_signee: 'charte_engagement_signee',
        last_access: 'last_access',
        admin_comments: 'admin_comments',
        fk_role_regular: 'fk_role_regular',
        expertise_topics_chosen: 'expertise_topics_chosen',
        expertise_comment: 'expertise_comment',
        password_conformity: 'password_conformity',
    };
    const setClauses = [];
    const replacements = {};

    allowedProperties.forEach((property) => {
        if (values && values[property] !== undefined) {
            setClauses.push(`${propertiesToColumns[property]} = :${property}`);
            replacements[property] = values[property];
        }
    });

    if (setClauses.length > 0) {
        const [, { rowCount }]: any = await sequelize.query(
            `UPDATE
                users
            SET
                ${setClauses.join(',')},
                updated_at = NOW()
            WHERE
                users.user_id = :userId`,
            {
                replacements: Object.assign(replacements, {
                    userId,
                }),
                transaction,
            },
        );

        if (rowCount === 0) {
            throw new Error(`The user #${userId} does not exist`);
        }
    }

    if (Array.isArray(values.email_unsubscriptions)) {
        await sequelize.query(
            'DELETE FROM user_email_unsubscriptions WHERE fk_user = :userId',
            {
                replacements: {
                    userId,
                },
                transaction,
            },
        );

        if (values.email_unsubscriptions.length > 0) {
            await sequelize.getQueryInterface().bulkInsert(
                'user_email_unsubscriptions',
                values.email_unsubscriptions.map(email => ({ fk_user: userId, email_subscription: email })),
                { transaction },
            );
        }
    }
};
