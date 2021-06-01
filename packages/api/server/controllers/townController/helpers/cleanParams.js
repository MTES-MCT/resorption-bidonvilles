function getIntOrNull(str) {
    const parsed = parseInt(str, 10);
    return !Number.isNaN(parsed) ? parsed : null;
}

function trim(str) {
    if (typeof str !== 'string') {
        return null;
    }

    return str.replace(/^\s*|\s*$/g, '');
}

module.exports = function cleanParams(body) {
    return {
        status: trim(body.status),
        closedAt: body.closed_at,
        solutions: body.solutions ? body.solutions.map(solution => ({
            id: parseInt(solution.id, 10),
            peopleAffected: getIntOrNull(solution.peopleAffected),
            householdsAffected: getIntOrNull(solution.householdsAffected),
        })) : [],
        closedWithSolutions: typeof body.closed_with_solutions === 'boolean' ? body.closed_with_solutions : null,
    };
};
