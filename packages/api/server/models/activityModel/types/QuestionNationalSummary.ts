export interface QuestionSummary {
    id: number,
    question: string
    created_by: string
}

export interface QuestionNationalSummary {
    questions: Array<QuestionSummary>,
    has_question_summary: Boolean
}
