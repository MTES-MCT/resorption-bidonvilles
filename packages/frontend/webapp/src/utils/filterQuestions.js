export default function (questions, filters) {
    return questions.filter((question) => {
        if (
            filters.length > 0 &&
            !question.tags.some(({ uid }) => filters.includes(uid))
        ) {
            return false;
        }

        return true;
    });
}
