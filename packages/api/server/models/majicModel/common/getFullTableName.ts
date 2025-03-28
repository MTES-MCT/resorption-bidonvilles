import { getAllowedSchemas, getAllowedTables } from './getWhiteLists';
import validateInput from './validateInput';

export default (dept: string, schema: string, shortTableName: string, tableName: string): string | null => {
    if (!validateInput(schema) || !validateInput(tableName)) {
        return null;
    }
    const currentYear = new Date().getFullYear();
    const ALLOWED_SCHEMAS = getAllowedSchemas(currentYear);
    const ALLOWED_TABLES = getAllowedTables(currentYear, dept, shortTableName);

    if (!ALLOWED_SCHEMAS.includes(schema) || !ALLOWED_TABLES.includes(tableName)) {
        return null;
    }

    return `"${schema}"."${tableName}"`;
};
