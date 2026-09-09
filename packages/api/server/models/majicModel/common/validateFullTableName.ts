const FULL_TABLE_NAME_PATTERN = /^\w+\.\w+$/;

// Garde-fou en défense en profondeur : getFullTableName garantit déjà que le nom de
// table provient d'une whitelist stricte, mais cette validation reste locale et
// visible juste avant l'interpolation SQL, indépendamment de cette garantie amont.
export default function validateFullTableName(fullTableName: string, dept: string): void {
    if (!FULL_TABLE_NAME_PATTERN.test(fullTableName)) {
        throw new Error(`Nom de table invalide pour le département ${dept}`);
    }
}
