const sequelize = require('#db/sequelize');

module.exports = (planId, topics, createdBy, transaction = undefined) => sequelize.query(
    `INSERT INTO plan_topics(fk_plan, fk_topic, created_by)
                VALUES ${topics.map(() => '(?, ?, ?)').join(', ')}`,
    {
        replacements: topics.reduce((acc, uid) => [
            ...acc,
            planId,
            uid,
            createdBy,
        ], []),
        transaction,
    },
);
