import { Where } from './types/Where';

function stringify(table: string, where: Where, replacements: { [key: string]: any }): string {
    return where.map((clauses, index) => {
        const clauseGroup = Object.keys(clauses).map((column) => {
            const clause = clauses[column];

            // Gère les clauses "AND" recursivement
            if (clause.andClauses) {
                return `(${stringify(table, clause.andClauses, replacements)})`;
            }
            const rawValue = clause.value;
            const selector = clause.query ?? `${table}.${column}`;
            const isOperator = rawValue === null || typeof rawValue === 'boolean';
            const notOperator = (clause as any).not === true; // 'not' is not in the type, but used in the old code
            const operator = clause.operator ?? (!isOperator ? 'IN' : '');
            const placeholder = `:${column}${index}`;

            let value: string;
            if (isOperator) {
                // Pour les valeurs booléennes et null, utiliser directement la valeur
                if (rawValue === null) {
                    value = 'NULL';
                } else if (typeof rawValue === 'boolean') {
                    value = rawValue ? 'TRUE' : 'FALSE';
                } else {
                    value = placeholder;
                    // eslint-disable-next-line no-param-reassign
                    replacements[placeholder.substring(1)] = rawValue;
                }
            } else {
                value = operator === 'IN' ? `(${placeholder})` : placeholder;
                // eslint-disable-next-line no-param-reassign
                replacements[placeholder.substring(1)] = rawValue;
            }

            return `${selector}${isOperator ? ' IS ' : ''}${notOperator ? ' NOT ' : ''}${operator ? ` ${operator} ` : ''} ${value}`;
        }).join(' OR ');

        return `(${clauseGroup})`;
    }).join(' AND ');
}

export default (table: string, where: Where, replacements: { [key: string]: any }): string => stringify(table, where, replacements);
