import { getAllowedSchemas, getAllowedTables } from './getWhiteLists';

// Garde-fou en défense en profondeur : recalcule indépendamment la whitelist déjà
// appliquée par getFullTableName et vérifie que fullTableName (avec ou sans le
// suffixe _encrypted ajouté par findOwners) y appartient réellement, plutôt que de
// se contenter de vérifier sa forme (schema.table).
export default function validateFullTableName(fullTableName: string, dept: string, shortTableName: string): void {
    const currentYear = new Date().getFullYear();
    const allowedSchemas = getAllowedSchemas(currentYear);
    const allowedTables = getAllowedTables(currentYear, dept, shortTableName);

    const allowedFullTableNames = allowedSchemas.flatMap(
        allowedSchema => allowedTables.flatMap(
            allowedTable => [`${allowedSchema}.${allowedTable}`, `${allowedSchema}.${allowedTable}_encrypted`],
        ),
    );

    if (!allowedFullTableNames.includes(fullTableName)) {
        throw new Error(`Nom de table invalide pour le département ${dept}`);
    }
}
