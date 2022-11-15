import { sequelize } from '#db/sequelize';

export default async (user, data) => sequelize.transaction(async (transaction) => {
    // comment
    const [[{ id }]]: any = await sequelize.query(
        `INSERT INTO
                high_covid_comments(
                    description,
                    created_by
                )
                
            VALUES
                (
                    :description,
                    :userId
                )
            
            RETURNING high_covid_comment_id AS id`,
        {
            replacements: {
                description: data.description,
                userId: user.id,
            },
            transaction,
        },
    );

    // territories
    const query = data.departements.map(() => '(?, ?, ?)').join(', ');
    const values = data.departements.reduce((acc, code) => [...acc, id, code, user.id], []);

    return sequelize.query(
        `INSERT INTO
                high_covid_comment_territories(
                    fk_comment,
                    fk_departement,
                    created_by
                )
                
            VALUES
                ${query}`,
        {
            replacements: values,
            transaction,
        },
    );
});
