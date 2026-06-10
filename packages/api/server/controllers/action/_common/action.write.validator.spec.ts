import chai from 'chai';
import { sumSchoolLevels, validateScolariseDansAnnee } from './action.write.validator';

const { expect } = chai;

// Indicateur de base valide : nombre_mineurs renseigné et niveaux suffisants.
// Chaque test surcharge les champs pertinents.
const baseIndicateur = () => ({
    nombre_mineurs: 100,
    scolaire_nombre_maternelle: 5,
    scolaire_nombre_elementaire: 4,
    scolaire_nombre_college: 3,
    scolaire_nombre_lycee: 2,
    scolaire_nombre_autre: 50,
    scolaire_mineur_scolarise_dans_annee: null,
});

describe('controllers/action/_common/action.write.validator', () => {
    describe('sumSchoolLevels', () => {
        it('additionne maternelle, élémentaire, collège et lycée', () => {
            expect(sumSchoolLevels({
                scolaire_nombre_maternelle: 1,
                scolaire_nombre_elementaire: 2,
                scolaire_nombre_college: 3,
                scolaire_nombre_lycee: 4,
            })).to.equal(10);
        });

        it('exclut scolaire_nombre_autre de la somme', () => {
            expect(sumSchoolLevels({
                scolaire_nombre_maternelle: 1,
                scolaire_nombre_elementaire: 1,
                scolaire_nombre_college: 1,
                scolaire_nombre_lycee: 1,
                scolaire_nombre_autre: 1000,
            })).to.equal(4);
        });

        it('ignore les valeurs non entières (null, undefined)', () => {
            expect(sumSchoolLevels({
                scolaire_nombre_maternelle: 3,
                scolaire_nombre_elementaire: null,
                scolaire_nombre_college: undefined,
                scolaire_nombre_lycee: 2,
            })).to.equal(5);
        });

        it('retourne 0 quand aucun niveau n\'est renseigné', () => {
            expect(sumSchoolLevels({})).to.equal(0);
        });
    });

    describe('validateScolariseDansAnnee', () => {
        it('retourne true quand la valeur est null ou undefined', () => {
            expect(validateScolariseDansAnnee(null, baseIndicateur())).to.equal(true);
            expect(validateScolariseDansAnnee(undefined, baseIndicateur())).to.equal(true);
        });

        it('lève une TypeError si nombre_mineurs n\'est pas renseigné', () => {
            const indicateur = { ...baseIndicateur(), nombre_mineurs: null };
            expect(() => validateScolariseDansAnnee(1, indicateur)).to.throw(TypeError);
        });

        it('lève une erreur si la valeur dépasse le nombre total de mineurs', () => {
            const indicateur = { ...baseIndicateur(), nombre_mineurs: 3 };
            expect(() => validateScolariseDansAnnee(4, indicateur))
                .to.throw('ne peut pas dépasser le nombre total de mineurs concernés par l\'action');
        });

        it('règle 3 : lève une erreur si la valeur dépasse la somme des niveaux (hors autre)', () => {
            // somme des niveaux = 5+4+3+2 = 14 ; "autre" (50) est ignoré
            const indicateur = baseIndicateur();
            expect(() => validateScolariseDansAnnee(15, indicateur))
                .to.throw('ne peut pas dépasser le total des mineurs scolarisés tous niveaux confondus');
        });

        it('règle 3 : accepte une valeur égale à la somme des niveaux', () => {
            // somme des niveaux = 14
            expect(validateScolariseDansAnnee(14, baseIndicateur())).to.equal(true);
        });

        it('règle 3 : accepte une valeur inférieure à la somme des niveaux', () => {
            expect(validateScolariseDansAnnee(10, baseIndicateur())).to.equal(true);
        });

        it('règle 3 : le champ "autre" n\'élargit pas la borne autorisée', () => {
            // Même avec autre=50, la borne reste la somme des 4 niveaux = 14
            const indicateur = { ...baseIndicateur(), scolaire_nombre_autre: 50 };
            expect(() => validateScolariseDansAnnee(20, indicateur))
                .to.throw('tous niveaux confondus');
        });
    });
});
