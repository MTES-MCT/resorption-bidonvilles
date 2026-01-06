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

    const safePattern = /^[\sa-zA-Z0-9_.:()]+$/;

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
        /\bSELECT\b/i, // SELECT imbriqué
        /\bFROM\b/i, // FROM imbriqué
        /\bWHERE\b/i, // WHERE imbriqué
        /\bCREATE\b/i, // CREATE
        /\bALTER\b/i, // ALTER
        /\bGRANT\b/i, // GRANT
        /\bREVOKE\b/i, // REVOKE
        /'[^']*'/, // Chaînes entre guillemets simples (non attendues)
        /"[^"]*"/, // Chaînes entre guillemets doubles (non attendues)
        /\$\{/, // Template string injection
        /\\/, // Backslash (échappement)
    ];

    const hasDangerousPattern = dangerousPatterns.some(pattern => pattern.test(whereClause));
    if (hasDangerousPattern) {
        throw new Error('Clause WHERE invalidc: contient des motifs potentiellement dangereux');
    }

    const words = whereClause.match(/\b[a-zA-Z]+\b/g) || [];
    const allowedWords = new Set(['AND', 'OR', 'IN', 'NOT', 'IS', 'NULL', 'TRUE', 'FALSE']);
    const hasUnauthorizedKeyword = words.some((word) => {
        const upperWord = word.toUpperCase();
        return word === upperWord && !allowedWords.has(upperWord);
    });

    if (hasUnauthorizedKeyword) {
        throw new Error('Clause WHERE invalidc: contient des mots-clés SQL non autorisés');
    }
}
