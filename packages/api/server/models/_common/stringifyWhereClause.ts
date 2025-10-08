import { Where, WhereClause } from './types/Where';

type ValueResult = {
    value: string;
    needsReplacement: boolean;
};

// Helper pour formater la valeur selon son type
function formatValue(rawValue: any, placeholder: string): ValueResult {
    if (rawValue === null) {
        return { value: 'NULL', needsReplacement: false };
    }
    if (typeof rawValue === 'boolean') {
        return { value: rawValue ? 'TRUE' : 'FALSE', needsReplacement: false };
    }
    return { value: placeholder, needsReplacement: true };
}

// Helper pour construire la valeur finale avec ou sans parenthèses
function buildValueString(
    rawValue: any,
    operator: string,
    placeholder: string,
    isOperator: boolean,
): ValueResult {
    if (isOperator) {
        return formatValue(rawValue, placeholder);
    }
    const wrappedPlaceholder = operator === 'IN' ? `(${placeholder})` : placeholder;
    return { value: wrappedPlaceholder, needsReplacement: true };
}

// Helper pour construire la clause SQL complète
function buildSqlClause(
    selector: string,
    isOperator: boolean,
    notOperator: boolean,
    operator: string,
    value: string,
): string {
    const isPrefix = isOperator ? ' IS ' : '';
    const notPrefix = notOperator ? ' NOT ' : '';
    const operatorStr = operator ? ` ${operator} ` : '';
    return `${selector}${isPrefix}${notPrefix}${operatorStr} ${value}`;
}

function stringify(table: string, where: Where, replacements: { [key: string]: any }): string {
    return where.map((clauses, index) => {
        const clauseGroup = Object.keys(clauses)
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            .map(column => processClause(table, column, clauses[column], index, replacements))
            .join(' OR ');

        return `(${clauseGroup})`;
    }).join(' AND ');
}

// Helper pour traiter une clause individuelle
function processClause(
    table: string,
    column: string,
    clause: WhereClause,
    index: number,
    replacements: { [key: string]: any },
): string {
    // Cas récursif pour les andClauses
    if (clause.andClauses) {
        return `(${stringify(table, clause.andClauses, replacements)})`;
    }

    const rawValue = clause.value;
    const selector = clause.query ?? `${table}.${column}`;
    const isOperator = rawValue === null || typeof rawValue === 'boolean';
    const notOperator = (clause as any).not === true;
    const operator = clause.operator ?? (isOperator ? '' : 'IN');
    const placeholder = `:${column}${index}`;

    const { value, needsReplacement } = buildValueString(rawValue, operator, placeholder, isOperator);

    if (needsReplacement) {
        // eslint-disable-next-line no-param-reassign
        replacements[placeholder.substring(1)] = rawValue;
    }

    return buildSqlClause(selector, isOperator, notOperator, operator, value);
}

export default function stringifyWhereClause(table: string, where: Where, replacements: { [key: string]: any }): string {
    return stringify(table, where, replacements);
}
