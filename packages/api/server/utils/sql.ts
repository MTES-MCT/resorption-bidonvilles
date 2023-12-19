export type WhereArrClause = (string | WhereObjClause)[];
export type WhereObjClause = { and?: WhereArrClause, or?: WhereArrClause };

export function buildWhere(obj: string | WhereArrClause | WhereObjClause, argOperator?: 'and' | 'or'): string {
    if (typeof obj === 'string') {
        return obj;
    }

    if (Array.isArray(obj)) {
        if (argOperator === undefined) {
            throw new Error('operator is required when obj is array');
        }

        return `(${obj.map(item => buildWhere(item)).join(` ${argOperator.toUpperCase()} `)})`;
    }

    const operator = Object.keys(obj)[0];
    if (operator !== 'and' && operator !== 'or') {
        throw new Error('operator is not valid');
    }

    return `(${buildWhere(obj[operator], operator)})`;
}

export default buildWhere;
