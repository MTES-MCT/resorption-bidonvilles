import { sequelize } from '#db/sequelize';

export default async (data, transaction = undefined) => {
    const [[{ id }]]: any = await sequelize.query(
        `INSERT INTO plans2(
            name,
            started_at,
            expected_to_end_at,
            in_and_out,
            goals,
            fk_category,
            location_type,
            location_details,
            fk_location,
            created_by
        ) VALUES(
            :name,
            :startedAt,
            :expectedToEndAt,
            :inAndOut,
            :goals,
            'autre',
            :locationType,
            :locationDetails,
            :fk_location,
            :createdBy
        ) RETURNING plan_id AS id`,
        {
            replacements:
            {
                name: data.name,
                startedAt: data.startedAt,
                expectedToEndAt: data.expectedToEndAt,
                inAndOut: data.inAndOut,
                goals: data.goals,
                locationType: data.locationType,
                locationDetails: data.locationDetails,
                fk_location: data.fk_location,
                createdBy: data.createdBy,
            },
            transaction,
        },
    );
    return id;
};
