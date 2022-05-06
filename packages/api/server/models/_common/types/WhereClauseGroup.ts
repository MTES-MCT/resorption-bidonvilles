import { WhereClause } from './WhereClause';

export type WhereClauseGroup = {
    [column: string]: WhereClause
};
