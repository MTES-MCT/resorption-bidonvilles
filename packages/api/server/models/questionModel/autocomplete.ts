import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export type QuestionAutocompleteRow = {
    id: number,
    question: string,
    details: string,
    similarity: number,
};

export default async (search: string): Promise<QuestionAutocompleteRow[]> => sequelize.query(
    `SELECT 
        questions.question_id AS id,
        questions.question,
        questions.details,
        GREATEST(
            word_similarity(unaccent(:search), unaccent(questions.question)),
            word_similarity(unaccent(:search), unaccent(questions.details))
        ) AS similarity
    FROM questions
    ORDER BY similarity DESC
    `,
    {
        type: QueryTypes.SELECT,
        replacements: {
            search,
        },
    },
);
