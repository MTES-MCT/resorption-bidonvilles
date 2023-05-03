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
    number_of_recent_answers: number,
    is_new: boolean,
};

export default async (argFrom: Date, argTo: Date): Promise<QuestionSummary[]> => {
    const from = moment(argFrom);
    const to = moment(argTo);
    const oldFrom: Date = new Date(to.toDate());
    oldFrom.setMonth(oldFrom.getMonth() - 2);

    const rows: Row[] = await sequelize.query(
        `WITH number_of_answers AS (
            SELECT
                fk_question,
                COUNT(*) AS total,
                MAX(created_at) AS last_answer_date
            FROM answers
            WHERE created_at >= :from AND created_at < :to
            GROUP BY fk_question
        )
        SELECT
            question_id as id,
            question,
            users.first_name,
            users.last_name,
            organizations.abbreviation AS organization_abbreviation,
            organizations.name AS organization_name,
            COALESCE(number_of_answers.total, 0) AS number_of_recent_answers,
            questions.created_at >= :from AS is_new
        FROM questions
        LEFT JOIN users ON users.user_id = questions.created_by
        LEFT JOIN organizations on organizations.organization_id = users.fk_organization
        LEFT JOIN number_of_answers ON number_of_answers.fk_question = questions.question_id
        WHERE (questions.created_at >= :oldFrom AND questions.created_at < :to) OR number_of_answers.total > 0
        ORDER BY number_of_answers.last_answer_date DESC, questions.created_at DESC
        `,
        {
            type: QueryTypes.SELECT,
            replacements: {
                oldFrom: moment(oldFrom).format('YYYY-MM-DD'),
                from: from.format('YYYY-MM-DD'),
                to: to.format('YYYY-MM-DD'),
            },
        },
    );

    return rows.map(row => ({
        id: row.id,
        question: row.question,
        created_by: `${row.first_name} ${row.last_name} (${row.organization_abbreviation ? row.organization_abbreviation : row.organization_name})`,
        is_new: row.is_new,
        number_of_recent_answers: row.number_of_recent_answers,
    }));
};
