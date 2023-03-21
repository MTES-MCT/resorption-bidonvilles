import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import moment from 'moment';
import { QuestionSummary } from '#server/models/activityModel/types/QuestionNationalSummary';

type Row = {
    id: number,
    question: string,
    first_name: string,
    last_name: string,
    organization_abbreviation: string,
    organization_name: string,
};

export default async (argFrom: Date, argTo: Date): Promise<QuestionSummary[]> => {
    const from = moment(argFrom);
    const to = moment(argTo);

    const rows: Row[] = await sequelize.query(
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

    return rows.map(row => ({
        id: row.id,
        question: row.question,
        created_by: `${row.first_name} ${row.last_name} (${row.organization_abbreviation ? row.organization_abbreviation : row.organization_name})`,
    }));
};
