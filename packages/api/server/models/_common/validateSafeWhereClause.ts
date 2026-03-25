/**
 * Valide que la clause WHERE générée ne contient que des éléments sécurisés.
 * Protection contre les injections SQL en vérifiant que la chaîne ne contient que :
 * - Des noms de colonnes valides (lettres, chiffres, underscores, points)
 * - Des placeholders nommés Sequelize (:placeholder)
 * - Des opérateurs SQL standards (AND, OR, IN, NOT, IS, NULL, TRUE, FALSE)
 * - Des parenthèses et espaces
 *
 * Cette validation est une couche de sécurité supplémentaire pour prévenir
 * les injections SQL lorsqu'on interpole des clauses WHERE générées dynamiquement.
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

    const dangerousPatterns = [
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
        /"[^"]*"/, // Chaînes entre guillemets doubles (non attendues)
        /\$\{/, // Template string injection
        /\\/, // Backslash (échappement)
    ];

    const hasDangerousPattern = dangerousPatterns.some(pattern => pattern.test(whereClause));
    if (hasDangerousPattern) {
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
