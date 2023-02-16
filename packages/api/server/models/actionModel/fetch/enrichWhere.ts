/* eslint-disable no-param-reassign */
export default (where: string[], replacements: object, clauseGroup: object): void => {
    const clause = [];
    Object.keys(clauseGroup).forEach((key) => {
        const { query, value } = clauseGroup[key];
        clause.push(`${query} IN (:${key})`);
        replacements[key] = value;
    });

    if (clause.length > 0) {
        where.push(`(${clause.join(' OR ')})`);
    }
};
