import { Primitive } from './Primitive';

export type WhereClause = {
    value: Primitive | Primitive[],
    query?: string,
    operator?: string,
    not?: boolean
};
