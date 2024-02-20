type BaseQuestionInput = {
    question: string,
    details: string,
    people_affected: number | null,
    tags: string[],
    other_tag: string | null,
};

export type InsertQuestionInput = BaseQuestionInput & {
    created_by: number,
};

export type UpdateQuestionInput = Partial<BaseQuestionInput> & {
    question_id: number,
    updated_by: number,
};

type QuestionInput = InsertQuestionInput | UpdateQuestionInput;

export default QuestionInput;
