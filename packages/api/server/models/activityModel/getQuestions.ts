import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import moment from 'moment';


export default async (argFrom: Date, argTo: Date): Promise<any> => {
    const from = moment(argFrom);
    const to = moment(argTo);

    const raws = await sequelize.query(
        `
        SELECT
            question_id as id,
            question,
            users.first_name,
            users.last_name,
            organizations.abbreviation AS organization_abbreviation,
            organizations.name AS organization_name
        FROM questions
        LEFT JOIN users ON users.user_id = questions.created_by
        LEFT JOIN organizations on organizations.organization_id = users.fk_organization
        WHERE questions.created_at >= :from AND questions.created_at < :to 
        `,
        {
            type: QueryTypes.SELECT,
            replacements: {
                from: from.format('YYYY-MM-DD'),
                to: to.format('YYYY-MM-DD'),
            },
        },
    );

    return raws.map((raw:any) => ({
        id: raw.id,
        question: raw.question,
        created_by: `${raw.first_name} ${raw.last_name} (${raw.organization_abbreviation ? raw.organization_abbreviation : raw.organization_name})`,
    }));
};
