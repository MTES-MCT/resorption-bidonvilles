module.exports = (table, where, replacements) => where.map((clauses, index) => {
    const clauseGroup = Object.keys(clauses).map((column) => {
        // eslint-disable-next-line no-param-reassign
        replacements[`${column}${index}`] = clauses[column].value || clauses[column];
        return `${clauses[column].query || `${table}.${column}`} ${clauses[column].not ? 'NOT ' : ''}IN (:${column}${index})`;
    }).join(' OR ');

    return `(${clauseGroup})`;
}).join(' AND ');
