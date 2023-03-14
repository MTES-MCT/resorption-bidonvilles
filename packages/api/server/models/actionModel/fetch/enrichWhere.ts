/* eslint-disable no-param-reassign */
export default (where: string[], replacements: object, clauseGroup: object, prefix: string = ''): void => {
    const clause = [];
    Object.keys(clauseGroup).forEach((key) => {
        const { query, value } = clauseGroup[key];
        clause.push(`${query} IN (:${prefix}_${key})`);
        replacements[`${prefix}_${key}`] = value;
    });

    if (clause.length > 0) {
        where.push(`(${clause.join(' OR ')})`);
    }
};
