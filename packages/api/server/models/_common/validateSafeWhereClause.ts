// Motifs de bas niveau interdits dans une clause WHERE, quelle que soit son origine.
const DANGEROUS_PATTERNS = [
    /;/, // Fin d'instruction SQL
    /--/, // Commentaire SQL
    /\/\*/, // Commentaire multi-ligne
    /\bDROP\b/i, // DROP TABLE/DATABASE
    /\bDELETE\b/i, // DELETE
    /\bUPDATE\b/i, // UPDATE
    /\bINSERT\b/i, // INSERT
    /\bEXEC\b/i, // EXEC
    /\bUNION\b/i, // UNION (injection classique)
    /\bCREATE\b/i, // CREATE
    /\bALTER\b/i, // ALTER
    /\bGRANT\b/i, // GRANT
    /\bREVOKE\b/i, // REVOKE
    /\$\{/, // Template string injection
    /\\/, // Backslash (échappement)
];

function hasDangerousPattern(whereClause: string): boolean {
    return DANGEROUS_PATTERNS.some(pattern => pattern.test(whereClause));
}

/**
 * Valide que la clause WHERE générée ne contient que des éléments sécurisés.
 * Protection contre les injections SQL en vérifiant que la chaîne ne contient que :
 * - Des noms de colonnes valides (lettres, chiffres, underscores, points)
 * - Des placeholders nommés Sequelize (:placeholder)
 * - Des opérateurs SQL standards (AND, OR, IN, NOT, IS, NULL, TRUE, FALSE)
 * - Des parenthèses et espaces
 *
 * Cette validation est une couche de sécurité supplémentaire pour prévenir
 * les injections SQL lorsqu'on interpole des clauses WHERE générées dynamiquement
 * à partir d'un objet Where structuré (colonnes/opérateurs écrits par les développeurs).
 *
 * @param whereClause - La clause WHERE générée par stringifyWhereClause
 * @throws {Error} Si la clause contient des caractères ou patterns suspects
 */
export default function validateSafeWhereClause(whereClause: string): void {
    if (!whereClause || whereClause === '()') {
        return;
    }

    // eslint-disable-next-line no-useless-escape
    const safePattern = /^[\sa-zA-Z0-9_.:()<>=,\-+*/%'{}\[\]|]+$/;

    if (!safePattern.test(whereClause)) {
        throw new Error('Clause WHERE invalide: contient des caractères non autorisés');
    }

    if (hasDangerousPattern(whereClause) || /"[^"]*"/.test(whereClause)) {
        throw new Error('Clause WHERE invalide: contient des motifs potentiellement dangereux');
    }

    const words = whereClause.match(/\b[a-zA-Z]+\b/g) || [];
    const allowedWords = new Set(['AND', 'OR', 'IN', 'NOT', 'IS', 'NULL', 'TRUE', 'FALSE', 'ILIKE', 'LIKE', 'BETWEEN', 'ASC', 'DESC', 'LOWER', 'UPPER', 'ASIN', 'SQRT', 'POWER', 'SIN', 'COS', 'EXISTS', 'SELECT', 'FROM', 'WHERE', 'UNNEST', 'AS', 'EXTRACT', 'YEAR', 'ARRAY']);
    const hasUnauthorizedKeyword = words.some((word) => {
        const upperWord = word.toUpperCase();
        // Vérifie les mots SQL (tout en majuscules) ET les patterns dangereux (insensibles à la casse)
        const sqlKeywords = ['DROP', 'DELETE', 'UPDATE', 'INSERT', 'EXEC', 'UNION', 'CREATE', 'ALTER', 'GRANT', 'REVOKE'];
        if (sqlKeywords.includes(upperWord)) {
            return true;
        }
        return word === upperWord && !allowedWords.has(upperWord);
    });

    if (hasUnauthorizedKeyword) {
        throw new Error('Clause WHERE invalide: contient des mots-clés SQL non autorisés');
    }
}

/**
 * Valide une clause WHERE dont le vocabulaire (opérateurs, fonctions SQL, guillemets
 * d'identifiants) est trop riche pour l'allowlist stricte de validateSafeWhereClause
 * (ex: DSL de userModel/_common/query.ts qui produit ANY(), &&, NOW(), ou une clause
 * générée par `sequelize.getQueryInterface().queryGenerator.getWhereConditions(...)`
 * dont les identifiants sont entre guillemets doubles).
 *
 * Plutôt qu'un jeu de caractères restreint, cette validation rejette uniquement les
 * motifs d'injection SQL de bas niveau (fin d'instruction, commentaires, mots-clés
 * DML/DDL, interpolation de template string, backslash) : les colonnes/opérateurs de
 * ce DSL sont toujours des littéraux écrits par les développeurs, seules les valeurs
 * varient et transitent par des replacements Sequelize paramétrés.
 *
 * @param whereClause - La clause WHERE générée dynamiquement
 * @throws {Error} Si la clause contient des motifs suspects
 */
export function validateWhereClauseAgainstInjectionPatterns(whereClause: string): void {
    if (!whereClause) {
        return;
    }

    if (hasDangerousPattern(whereClause)) {
        throw new Error('Clause WHERE invalide: contient des motifs potentiellement dangereux');
    }
}
