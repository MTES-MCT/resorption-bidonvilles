const SQL_IDENTIFIER_PATTERN = /^\w+$/;

export default function isValidSqlIdentifier(identifier: string): boolean {
    return SQL_IDENTIFIER_PATTERN.test(identifier);
}
