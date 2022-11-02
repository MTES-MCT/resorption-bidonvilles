import { sequelize } from '#db/sequelize';

export default async (data, transaction = undefined) => {
    const [[{ id }]]: any = await sequelize.query(
        `INSERT INTO locations(
            address,
            latitude,
            longitude,
            created_by
        ) VALUES(
            :address,
            :latitude,
            :longitude,
            :createdBy
        ) RETURNING location_id AS id`,
        {
            replacements:
            {
                address: data.address,
                latitude: data.latitude,
                longitude: data.longitude,
                createdBy: data.createdBy,
            },
            transaction,
        },
    );

    return id;
};
