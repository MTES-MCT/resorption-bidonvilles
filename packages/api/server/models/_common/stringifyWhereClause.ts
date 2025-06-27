export default (table, where, replacements) => where.map((clauses, index) => {
    const clauseGroup = Object.keys(clauses).map((column) => {
        const rawValue = clauses[column].value === undefined ? clauses[column] : clauses[column].value;

        const selector = clauses[column].query ?? `${table}.${column}`;
        const isOperator = rawValue === null || typeof rawValue === 'boolean';
        const notOperator = clauses[column].not === true;
        const operator = clauses[column].operator ?? (!isOperator ? 'IN' : '');
        const value = operator === 'IN' ? `(:${column}${index})` : `:${column}${index}`;

        // eslint-disable-next-line no-param-reassign
        replacements[`${column}${index}`] = rawValue;
        return `${selector}${isOperator ? ' IS ' : ''}${notOperator ? ' NOT ' : ''}${operator ? ` ${operator} ` : ''} ${value}`;
    }).join(' OR ');

    return `(${clauseGroup})`;
}).join(' AND ');
