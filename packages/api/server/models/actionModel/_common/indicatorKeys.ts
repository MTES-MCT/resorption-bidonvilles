import { ActionInput } from '#server/services/action/ActionInput.d';

type YearIndicators = ActionInput['indicateurs'][string];

export const INDICATOR_KEYS: (keyof YearIndicators)[] = [
    'nombre_personnes',
    'nombre_menages',
    'nombre_femmes',
    'nombre_mineurs',
    'sante_nombre_personnes',
    'travail_nombre_personnes',
    'travail_nombre_femmes',
    'hebergement_nombre_personnes',
    'hebergement_nombre_menages',
    'logement_nombre_personnes',
    'logement_nombre_menages',
    'scolaire_mineurs_moins_de_trois_ans',
    'scolaire_mineurs_trois_ans_et_plus',
    'scolaire_mediation_moins_de_trois_ans',
    'scolaire_mediation_trois_ans_et_plus',
    'scolaire_nombre_maternelle',
    'scolaire_nombre_elementaire',
    'scolaire_nombre_college',
    'scolaire_nombre_lycee',
    'scolaire_nombre_autre',
    'scolaire_mineur_scolarise_dans_annee',
];

export const SCOLAIRE_KEYS: (keyof YearIndicators)[] = INDICATOR_KEYS.filter(key => key.startsWith('scolaire_'));

export const NON_SCOLAIRE_KEYS: (keyof YearIndicators)[] = INDICATOR_KEYS.filter(key => !key.startsWith('scolaire_'));

/**
 * Vrai si au moins un des champs a une valeur : ni null, ni undefined, ni chaîne vide (0 est une valeur).
 */
export function hasAnyValue(source: Partial<Record<keyof YearIndicators, unknown>>, keys: (keyof YearIndicators)[]): boolean {
    return keys.some(key => source[key] !== null && source[key] !== undefined && source[key] !== '');
}
