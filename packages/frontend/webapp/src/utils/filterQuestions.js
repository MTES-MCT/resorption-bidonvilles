export default function (questions, filters) {
    const trimmedSearch = (filters.search || "")
        .toLowerCase()
        .replace(/^\s*|\s*$/g, "")
        .replace(/\s+/g, " ");
    const searchKeywords = trimmedSearch !== "" ? trimmedSearch.split(" ") : [];

    return questions.filter((question) => {
        if (
            filters.tags.length > 0 &&
            !question.tags.some(({ uid }) => filters.tags.includes(uid))
        ) {
            return false;
        }

        if (
            searchKeywords.length > 0 &&
            !searchKeywords.every(
                (keyword) =>
                    question.question.toLowerCase().includes(keyword) ||
                    question.details.toLowerCase().includes(keyword)
            )
        ) {
            return false;
        }

        return true;
    });
}
