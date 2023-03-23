type QuestionInput = {
    question: string,
    details: string,
    people_affected: number | null,
    tags: string[],
    other_tag: string | null,
    created_by: number,
};

export default QuestionInput;
