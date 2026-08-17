/**
 * Trie les phases préparatoires à la résorption selon la règle suivante :
 * 1. Les phases complétées (completedAt !== null) passent en premier
 * 2. Parmi les phases complétées, tri par date décroissante (plus récente d'abord)
 * 3. Les phases en cours (completedAt === null) passent ensuite
 * 4. Parmi les phases en cours, tri par date de création décroissante (plus récente d'abord)
 *
 * @param phases - Liste des phases à trier
 * @returns Nouvelle liste triée (shallow copy)
 */
type PreparatoryPhase = {
    completedAt: string | Date | null;
    createdAt: string | Date;
};

const sortPreparatoryPhases = <T extends PreparatoryPhase>(phases: T[]): T[] => {
    const comparePhases = (a: PreparatoryPhase, b: PreparatoryPhase): number => {
        // Les deux phases sont complétées : tri par date de complétion décroissante
        if (a.completedAt !== null && b.completedAt !== null) {
            return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
        }

        // Phase a complétée, phase b en cours : a passe avant b
        if (a.completedAt !== null && b.completedAt === null) {
            return -1;
        }

        // Phase a en cours, phase b complétée : b passe avant a
        if (a.completedAt === null && b.completedAt !== null) {
            return 1;
        }

        // Les deux phases sont en cours : tri par date de création décroissante
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    };

    return [...phases].sort(comparePhases);
};

export default sortPreparatoryPhases;
