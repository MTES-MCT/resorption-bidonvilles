import { sequelize } from '#db/sequelize';

export default async (user, transaction = undefined) => {
    const response = await sequelize.query(
        `INSERT INTO
            users(
                first_name,
                last_name,
                email,
                fk_organization,
                fk_role_regular,
                position,
                access_request_message,
                salt,
                phone,
                fk_status,
                created_by
            )

            VALUES(
                :first_name,
                :last_name,
                :email,
                :organization,
                :fk_role_regular,
                :position,
                :access_request_message,
                :salt,
                :phone,
                'new',
                :created_by
            )
            
            RETURNING user_id`,
        {
            replacements: user,
            transaction,
        },
    );

    return response[0][0].user_id;
};
