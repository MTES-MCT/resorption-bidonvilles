import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { rewiremock } from '#test/rewiremock';
import { ActionInput } from '#server/services/action/ActionInput.d';
import { ActionMetricsRow } from '../fetch/fetchMetrics';

const { expect } = chai;
chai.use(sinonChai);

/**
 * Contrat testé : `update/updateMetrics.ts`
 *
 *   export default function updateMetrics(actionId: number, authorId: number, data: ActionInput, transaction: Transaction): Promise<void>
 *   export function planMetricsUpdate(currentRows: ActionMetricsRow[], incoming: ActionInput['indicateurs']): MetricsUpdatePlan
 *   type MetricsUpdatePlan = { hasChanges: boolean, keptYears: number[], yearsToWrite: string[] }
 *
 *  - keptYears    : années présentes dans le formulaire et identiques à l'unique ligne de rang 1 correspondante ;
 *  - yearsToWrite : années présentes dans le formulaire (clé telle que reçue) et nouvelles ou modifiées ;
 *  - hasChanges   : yearsToWrite non vide OU au moins une année courante (rang 1) absente du formulaire.
 *
 * Séquence d'écriture (une seule transaction) quand hasChanges :
 *   createMetricsVersion -> [moveMetricsToVersion si keptYears non vide] -> deleteMetricsOutsideVersion
 *   -> [insertMetrics si yearsToWrite non vide] -> deleteOrphanMetricsVersions.
 */

type Indicateurs = ActionInput['indicateurs'][string];

const INDICATOR_COLUMNS = [
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
] as const satisfies readonly (keyof Indicateurs)[];

const sandbox = sinon.createSandbox();
const stubs = {
    fetchMetrics: sandbox.stub(),
    createMetricsVersion: sandbox.stub(),
    moveMetricsToVersion: sandbox.stub(),
    deleteMetricsOutsideVersion: sandbox.stub(),
    insertMetrics: sandbox.stub(),
    deleteOrphanMetricsVersions: sandbox.stub(),
};

rewiremock('../fetch/fetchMetrics').with(stubs.fetchMetrics);
rewiremock('./createMetricsVersion').with(stubs.createMetricsVersion);
rewiremock('./moveMetricsToVersion').with(stubs.moveMetricsToVersion);
rewiremock('./deleteMetricsOutsideVersion').with(stubs.deleteMetricsOutsideVersion);
rewiremock('../create/insertMetrics').with(stubs.insertMetrics);
rewiremock('./deleteOrphanMetricsVersions').with(stubs.deleteOrphanMetricsVersions);
// utilitaire pur réutilisé par updateMetrics : on laisse passer l'implémentation réelle
rewiremock.passBy(/hasMetricValues/);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import updateMetrics, { planMetricsUpdate } from './updateMetrics';
rewiremock.disable();

function buildIndicateurs(override: Partial<Indicateurs> = {}): Indicateurs {
    const base = INDICATOR_COLUMNS.reduce((acc, column) => ({ ...acc, [column]: null }), {} as Indicateurs);

    return { ...base, ...override };
}

function buildRow(
    year: number,
    override: Partial<Indicateurs> = {},
    options: { rank?: number, date?: string | Date } = {},
): ActionMetricsRow {
    return {
        rank: options.rank ?? 1,
        action_id: 7,
        date: options.date ?? `${year}-12-31`,
        created_at: new Date(2025, 0, 15, 10, 0, 0),
        version_at: new Date(2025, 0, 15, 10, 0, 0),
        creator_id: 99,
        ...buildIndicateurs(override),
    } as unknown as ActionMetricsRow;
}

function sortedNumbers(values: number[]): number[] {
    return [...values].sort((a, b) => a - b);
}

function sortedStrings(values: string[]): string[] {
    return [...values].sort();
}

describe('models/actionModel/update/updateMetrics', () => {
    describe('planMetricsUpdate()', () => {
        it('ne prévoit aucun changement quand les indicateurs sont identiques', () => {
            const plan = planMetricsUpdate(
                [buildRow(2022, { nombre_personnes: 10 }), buildRow(2023, { nombre_personnes: 20 })],
                {
                    2022: buildIndicateurs({ nombre_personnes: 10 }),
                    2023: buildIndicateurs({ nombre_personnes: 20 }),
                },
            );

            expect(plan.hasChanges).to.equal(false);
            expect(sortedNumbers(plan.keptYears)).to.eql([2022, 2023]);
            expect(plan.yearsToWrite).to.eql([]);
        });

        it('conserve les années identiques et réécrit uniquement l\'année modifiée', () => {
            const plan = planMetricsUpdate(
                [buildRow(2022, { nombre_personnes: 10 }), buildRow(2023, { nombre_personnes: 20 })],
                {
                    2022: buildIndicateurs({ nombre_personnes: 10 }),
                    2023: buildIndicateurs({ nombre_personnes: 25 }),
                },
            );

            expect(plan.hasChanges).to.equal(true);
            expect(plan.keptYears).to.eql([2022]);
            expect(plan.yearsToWrite).to.eql(['2023']);
        });

        it('prévoit l\'écriture d\'une année ajoutée', () => {
            const plan = planMetricsUpdate(
                [buildRow(2022, { nombre_personnes: 10 })],
                {
                    2022: buildIndicateurs({ nombre_personnes: 10 }),
                    2023: buildIndicateurs({ nombre_personnes: 5 }),
                },
            );

            expect(plan.hasChanges).to.equal(true);
            expect(plan.keptYears).to.eql([2022]);
            expect(plan.yearsToWrite).to.eql(['2023']);
        });

        it('détecte une année retirée du formulaire : changement sans rien à écrire', () => {
            const plan = planMetricsUpdate(
                [buildRow(2022, { nombre_personnes: 10 }), buildRow(2023, { nombre_personnes: 20 })],
                { 2023: buildIndicateurs({ nombre_personnes: 20 }) },
            );

            expect(plan.hasChanges).to.equal(true);
            expect(plan.keptYears).to.eql([2023]);
            expect(plan.yearsToWrite).to.eql([]);
        });

        it('traite une année dont tous les indicateurs sont vidés comme retirée', () => {
            const plan = planMetricsUpdate(
                [buildRow(2022, { nombre_personnes: 10 })],
                { 2022: buildIndicateurs() },
            );

            expect(plan.hasChanges).to.equal(true);
            expect(plan.keptYears).to.eql([]);
            expect(plan.yearsToWrite).to.eql([]);
        });

        it('traite des chaînes vides comme une année vidée', () => {
            const plan = planMetricsUpdate(
                [buildRow(2022, { nombre_personnes: 10 })],
                { 2022: buildIndicateurs({ nombre_personnes: '' as unknown as null }) },
            );

            expect(plan.hasChanges).to.equal(true);
            expect(plan.keptYears).to.eql([]);
            expect(plan.yearsToWrite).to.eql([]);
        });

        it('détecte un formulaire vide alors que des lignes existent', () => {
            const plan = planMetricsUpdate(
                [buildRow(2022, { nombre_personnes: 10 }), buildRow(2023, { nombre_personnes: 20 })],
                {},
            );

            expect(plan.hasChanges).to.equal(true);
            expect(plan.keptYears).to.eql([]);
            expect(plan.yearsToWrite).to.eql([]);
        });

        it('prévoit l\'écriture de toutes les années renseignées quand aucune ligne n\'existe', () => {
            const plan = planMetricsUpdate(
                [],
                {
                    2022: buildIndicateurs({ nombre_personnes: 10 }),
                    2023: buildIndicateurs({ nombre_personnes: 20 }),
                },
            );

            expect(plan.hasChanges).to.equal(true);
            expect(plan.keptYears).to.eql([]);
            expect(sortedStrings(plan.yearsToWrite)).to.eql(['2022', '2023']);
        });

        it('ne prévoit aucun changement quand il n\'y a ni ligne existante ni indicateur renseigné', () => {
            expect(planMetricsUpdate([], {})).to.eql({ hasChanges: false, keptYears: [], yearsToWrite: [] });
            expect(planMetricsUpdate([], { 2022: buildIndicateurs() })).to.eql({ hasChanges: false, keptYears: [], yearsToWrite: [] });
        });

        describe('lignes de rang supérieur à 1 (anciennes versions)', () => {
            it('les ignore : une ancienne version différente ne provoque aucun changement', () => {
                const plan = planMetricsUpdate(
                    [
                        buildRow(2022, { nombre_personnes: 10 }),
                        buildRow(2022, { nombre_personnes: 99 }, { rank: 2 }),
                        buildRow(2021, { nombre_personnes: 1 }, { rank: 2 }),
                        buildRow(2020, { nombre_personnes: 1 }, { rank: 3 }),
                    ],
                    { 2022: buildIndicateurs({ nombre_personnes: 10 }) },
                );

                expect(plan.hasChanges).to.equal(false);
                expect(plan.keptYears).to.eql([2022]);
                expect(plan.yearsToWrite).to.eql([]);
            });

            it('ne compare pas le formulaire à une ancienne version : l\'année est ajoutée si seul le rang 2 la contient', () => {
                const plan = planMetricsUpdate(
                    [buildRow(2022, { nombre_personnes: 10 }, { rank: 2 })],
                    { 2022: buildIndicateurs({ nombre_personnes: 10 }) },
                );

                expect(plan.hasChanges).to.equal(true);
                expect(plan.keptYears).to.eql([]);
                expect(plan.yearsToWrite).to.eql(['2022']);
            });
        });

        describe('plusieurs lignes de rang 1 pour la même année', () => {
            it('force la réécriture même si le formulaire est identique aux deux lignes', () => {
                const plan = planMetricsUpdate(
                    [buildRow(2022, { nombre_personnes: 10 }), buildRow(2022, { nombre_personnes: 10 })],
                    { 2022: buildIndicateurs({ nombre_personnes: 10 }) },
                );

                expect(plan.hasChanges).to.equal(true);
                expect(plan.keptYears).to.eql([]);
                expect(plan.yearsToWrite).to.eql(['2022']);
            });

            it('force la réécriture quand le formulaire ne correspond qu\'à l\'une des lignes', () => {
                const plan = planMetricsUpdate(
                    [buildRow(2022, { nombre_personnes: 10 }), buildRow(2022, { nombre_personnes: 20 })],
                    { 2022: buildIndicateurs({ nombre_personnes: 20 }) },
                );

                expect(plan.hasChanges).to.equal(true);
                expect(plan.keptYears).to.eql([]);
                expect(plan.yearsToWrite).to.eql(['2022']);
            });

            it('ne conserve pas l\'année doublonnée mais conserve les autres', () => {
                const plan = planMetricsUpdate(
                    [
                        buildRow(2022, { nombre_personnes: 10 }),
                        buildRow(2022, { nombre_personnes: 10 }),
                        buildRow(2023, { nombre_personnes: 20 }),
                    ],
                    {
                        2022: buildIndicateurs({ nombre_personnes: 10 }),
                        2023: buildIndicateurs({ nombre_personnes: 20 }),
                    },
                );

                expect(plan.keptYears).to.eql([2023]);
                expect(plan.yearsToWrite).to.eql(['2022']);
            });

            it('traite l\'année doublonnée comme retirée si elle est absente du formulaire', () => {
                const plan = planMetricsUpdate(
                    [buildRow(2022, { nombre_personnes: 10 }), buildRow(2022, { nombre_personnes: 10 })],
                    {},
                );

                expect(plan.hasChanges).to.equal(true);
                expect(plan.keptYears).to.eql([]);
                expect(plan.yearsToWrite).to.eql([]);
            });
        });

        describe('0, null, undefined et chaîne vide', () => {
            it('distingue 0 de null (ligne en base null, formulaire 0)', () => {
                const plan = planMetricsUpdate(
                    [buildRow(2022, { nombre_personnes: 10, nombre_menages: null })],
                    { 2022: buildIndicateurs({ nombre_personnes: 10, nombre_menages: 0 }) },
                );

                expect(plan.hasChanges).to.equal(true);
                expect(plan.yearsToWrite).to.eql(['2022']);
            });

            it('distingue 0 de null (ligne en base 0, formulaire null)', () => {
                const plan = planMetricsUpdate(
                    [buildRow(2022, { nombre_personnes: 10, nombre_menages: 0 })],
                    { 2022: buildIndicateurs({ nombre_personnes: 10, nombre_menages: null }) },
                );

                expect(plan.hasChanges).to.equal(true);
                expect(plan.yearsToWrite).to.eql(['2022']);
            });

            it('considère 0 identique à 0', () => {
                const plan = planMetricsUpdate(
                    [buildRow(2022, { nombre_personnes: 0 })],
                    { 2022: buildIndicateurs({ nombre_personnes: 0 }) },
                );

                expect(plan.hasChanges).to.equal(false);
                expect(plan.keptYears).to.eql([2022]);
            });

            it('considère une année dont la seule valeur est 0 comme présente (et non retirée)', () => {
                const plan = planMetricsUpdate(
                    [],
                    { 2022: buildIndicateurs({ nombre_personnes: 0 }) },
                );

                expect(plan.hasChanges).to.equal(true);
                expect(plan.yearsToWrite).to.eql(['2022']);
            });

            it('considère null, undefined et chaîne vide comme équivalents', () => {
                const plan = planMetricsUpdate(
                    [buildRow(2022, { nombre_personnes: 10 })],
                    {
                        2022: {
                            nombre_personnes: 10,
                            nombre_menages: '' as unknown as null,
                            nombre_femmes: undefined as unknown as null,
                            nombre_mineurs: null,
                        } as unknown as Indicateurs,
                    },
                );

                expect(plan.hasChanges).to.equal(false);
                expect(plan.keptYears).to.eql([2022]);
                expect(plan.yearsToWrite).to.eql([]);
            });

            it('considère une valeur non numérique comme différente', () => {
                const plan = planMetricsUpdate(
                    [buildRow(2022, { nombre_personnes: 10, nombre_menages: null })],
                    { 2022: buildIndicateurs({ nombre_personnes: 10, nombre_menages: 'abc' as unknown as number }) },
                );

                expect(plan.hasChanges).to.equal(true);
                expect(plan.yearsToWrite).to.eql(['2022']);
            });

            it('considère une valeur non numérique différente d\'une valeur numérique', () => {
                const plan = planMetricsUpdate(
                    [buildRow(2022, { nombre_personnes: 10 })],
                    { 2022: buildIndicateurs({ nombre_personnes: 'abc' as unknown as number }) },
                );

                expect(plan.hasChanges).to.equal(true);
                expect(plan.yearsToWrite).to.eql(['2022']);
            });
        });

        describe('chacune des 21 colonnes d\'indicateurs est comparée', () => {
            it('couvre bien 21 colonnes', () => {
                expect(INDICATOR_COLUMNS).to.have.lengthOf(21);
            });

            INDICATOR_COLUMNS.forEach((column) => {
                // colonne « témoin » qui garantit que l'année reste présente quoi qu'il arrive sur la colonne testée
                const witness = column === 'nombre_personnes' ? 'nombre_menages' : 'nombre_personnes';

                it(`${column} : valeur modifiée => année réécrite`, () => {
                    const plan = planMetricsUpdate(
                        [buildRow(2022, { [witness]: 10, [column]: 5 })],
                        { 2022: buildIndicateurs({ [witness]: 10, [column]: 6 }) },
                    );

                    expect(plan.hasChanges).to.equal(true);
                    expect(plan.keptYears).to.eql([]);
                    expect(plan.yearsToWrite).to.eql(['2022']);
                });

                it(`${column} : valeur ajoutée (null => 0) => année réécrite`, () => {
                    const plan = planMetricsUpdate(
                        [buildRow(2022, { [witness]: 10 })],
                        { 2022: buildIndicateurs({ [witness]: 10, [column]: 0 }) },
                    );

                    expect(plan.hasChanges).to.equal(true);
                    expect(plan.yearsToWrite).to.eql(['2022']);
                });

                it(`${column} : valeur effacée => année réécrite`, () => {
                    const plan = planMetricsUpdate(
                        [buildRow(2022, { [witness]: 10, [column]: 5 })],
                        { 2022: buildIndicateurs({ [witness]: 10 }) },
                    );

                    expect(plan.hasChanges).to.equal(true);
                    expect(plan.yearsToWrite).to.eql(['2022']);
                });

                it(`${column} : valeur identique => année conservée`, () => {
                    const plan = planMetricsUpdate(
                        [buildRow(2022, { [witness]: 10, [column]: 5 })],
                        { 2022: buildIndicateurs({ [witness]: 10, [column]: 5 }) },
                    );

                    expect(plan.hasChanges).to.equal(false);
                    expect(plan.keptYears).to.eql([2022]);
                    expect(plan.yearsToWrite).to.eql([]);
                });
            });
        });

        describe('déduction de l\'année depuis la date de la ligne', () => {
            it('lit l\'année dans les 4 premiers caractères d\'une date DATEONLY au 1er janvier', () => {
                const plan = planMetricsUpdate(
                    [buildRow(2022, { nombre_personnes: 10 }, { date: '2022-01-01' })],
                    { 2022: buildIndicateurs({ nombre_personnes: 10 }) },
                );

                expect(plan.hasChanges).to.equal(false);
                expect(plan.keptYears).to.eql([2022]);
            });

            it('lit l\'année dans les 4 premiers caractères d\'une date DATEONLY au 31 décembre', () => {
                const plan = planMetricsUpdate(
                    [buildRow(2022, { nombre_personnes: 10 }, { date: '2022-12-31' })],
                    { 2022: buildIndicateurs({ nombre_personnes: 10 }) },
                );

                expect(plan.hasChanges).to.equal(false);
                expect(plan.keptYears).to.eql([2022]);
            });

            it('utilise getFullYear quand la date est un objet Date (1er janvier)', () => {
                const plan = planMetricsUpdate(
                    [buildRow(2022, { nombre_personnes: 10 }, { date: new Date(2022, 0, 1, 0, 0, 0) })],
                    { 2022: buildIndicateurs({ nombre_personnes: 10 }) },
                );

                expect(plan.hasChanges).to.equal(false);
                expect(plan.keptYears).to.eql([2022]);
            });

            it('utilise getFullYear quand la date est un objet Date (31 décembre)', () => {
                const plan = planMetricsUpdate(
                    [buildRow(2022, { nombre_personnes: 10 }, { date: new Date(2022, 11, 31, 23, 59, 59) })],
                    { 2022: buildIndicateurs({ nombre_personnes: 10 }) },
                );

                expect(plan.hasChanges).to.equal(false);
                expect(plan.keptYears).to.eql([2022]);
            });

            it('rattache une ligne au 1er janvier à son année (pas à l\'année précédente) quand elle est modifiée', () => {
                const plan = planMetricsUpdate(
                    [buildRow(2022, { nombre_personnes: 10 }, { date: '2022-01-01' })],
                    { 2022: buildIndicateurs({ nombre_personnes: 11 }) },
                );

                expect(plan.keptYears).to.eql([]);
                expect(plan.yearsToWrite).to.eql(['2022']);
            });

            it('rattache une ligne au 31 décembre à son année (pas à la suivante) quand elle est retirée', () => {
                const plan = planMetricsUpdate(
                    [buildRow(2022, { nombre_personnes: 10 }, { date: '2022-12-31' })],
                    { 2023: buildIndicateurs({ nombre_personnes: 10 }) },
                );

                expect(plan.hasChanges).to.equal(true);
                expect(plan.keptYears).to.eql([]);
                expect(plan.yearsToWrite).to.eql(['2023']);
            });
        });

        describe('lignes de rang 1 entièrement vides (21 colonnes sans valeur)', () => {
            function buildOverride(value: null | undefined | string): Partial<Indicateurs> {
                return INDICATOR_COLUMNS.reduce((acc, column) => ({ ...acc, [column]: value }), {} as Partial<Indicateurs>);
            }

            it('ignore une ligne vide absente du formulaire : aucun changement, rien conservé ni écrit', () => {
                const plan = planMetricsUpdate([buildRow(2022)], {});

                expect(plan).to.eql({ hasChanges: false, keptYears: [], yearsToWrite: [] });
            });

            it('ignore une ligne vide quand le formulaire contient la même année entièrement vide', () => {
                const plan = planMetricsUpdate([buildRow(2022)], { 2022: buildIndicateurs() });

                expect(plan).to.eql({ hasChanges: false, keptYears: [], yearsToWrite: [] });
            });

            it('écrit l\'année (jamais conservée) quand le formulaire renseigne au moins une valeur pour une ligne vide', () => {
                const plan = planMetricsUpdate(
                    [buildRow(2022)],
                    { 2022: buildIndicateurs({ nombre_personnes: 10 }) },
                );

                expect(plan.hasChanges).to.equal(true);
                expect(plan.keptYears).to.eql([]);
                expect(plan.yearsToWrite).to.eql(['2022']);
            });

            it('n\'écrit ni ne conserve l\'année vide quand une autre année est modifiée ; les années inchangées restent conservées', () => {
                const plan = planMetricsUpdate(
                    [
                        buildRow(2021),
                        buildRow(2022, { nombre_personnes: 10 }),
                        buildRow(2023, { nombre_personnes: 20 }),
                    ],
                    {
                        2022: buildIndicateurs({ nombre_personnes: 10 }),
                        2023: buildIndicateurs({ nombre_personnes: 25 }),
                    },
                );

                expect(plan.hasChanges).to.equal(true);
                expect(plan.keptYears).to.eql([2022]);
                expect(plan.yearsToWrite).to.eql(['2023']);
            });

            it('ne déclenche aucun changement quand les autres années sont identiques au formulaire', () => {
                const plan = planMetricsUpdate(
                    [buildRow(2021), buildRow(2022, { nombre_personnes: 10 })],
                    { 2022: buildIndicateurs({ nombre_personnes: 10 }) },
                );

                expect(plan.hasChanges).to.equal(false);
                expect(plan.keptYears).to.eql([2022]);
                expect(plan.yearsToWrite).to.eql([]);
            });

            it('traite toujours comme retirée une ligne avec des valeurs absente du formulaire', () => {
                const plan = planMetricsUpdate(
                    [buildRow(2021), buildRow(2022, { nombre_personnes: 10 })],
                    {},
                );

                expect(plan.hasChanges).to.equal(true);
                expect(plan.keptYears).to.eql([]);
                expect(plan.yearsToWrite).to.eql([]);
            });

            it('ne considère pas vide une ligne dont la seule valeur est 0 : identique au formulaire => conservée', () => {
                const plan = planMetricsUpdate(
                    [buildRow(2022, { nombre_personnes: 0 })],
                    { 2022: buildIndicateurs({ nombre_personnes: 0 }) },
                );

                expect(plan.hasChanges).to.equal(false);
                expect(plan.keptYears).to.eql([2022]);
                expect(plan.yearsToWrite).to.eql([]);
            });

            it('ne considère pas vide une ligne dont la seule valeur est 0 : différente du formulaire => écrite', () => {
                const plan = planMetricsUpdate(
                    [buildRow(2022, { nombre_personnes: 0 })],
                    { 2022: buildIndicateurs({ nombre_personnes: 3 }) },
                );

                expect(plan.hasChanges).to.equal(true);
                expect(plan.keptYears).to.eql([]);
                expect(plan.yearsToWrite).to.eql(['2022']);
            });

            it('ne considère pas vide une ligne dont la seule valeur est 0 : absente du formulaire => retirée', () => {
                const plan = planMetricsUpdate([buildRow(2022, { nombre_menages: 0 })], {});

                expect(plan.hasChanges).to.equal(true);
                expect(plan.keptYears).to.eql([]);
                expect(plan.yearsToWrite).to.eql([]);
            });

            it('considère vide une ligne dont toutes les colonnes valent une chaîne vide', () => {
                const plan = planMetricsUpdate([buildRow(2022, buildOverride(''))], {});

                expect(plan).to.eql({ hasChanges: false, keptYears: [], yearsToWrite: [] });
            });

            it('considère vide une ligne dont toutes les colonnes valent undefined', () => {
                const plan = planMetricsUpdate([buildRow(2022, buildOverride(undefined))], {});

                expect(plan).to.eql({ hasChanges: false, keptYears: [], yearsToWrite: [] });
            });

            it('ignore la ligne vide d\'un doublon de rang 1 et compare l\'autre seule (identique => conservée)', () => {
                const plan = planMetricsUpdate(
                    [buildRow(2022), buildRow(2022, { nombre_personnes: 10 })],
                    { 2022: buildIndicateurs({ nombre_personnes: 10 }) },
                );

                expect(plan.hasChanges).to.equal(false);
                expect(plan.keptYears).to.eql([2022]);
                expect(plan.yearsToWrite).to.eql([]);
            });

            it('ignore la ligne vide d\'un doublon de rang 1 quel que soit l\'ordre des lignes', () => {
                const plan = planMetricsUpdate(
                    [buildRow(2022, { nombre_personnes: 10 }), buildRow(2022)],
                    { 2022: buildIndicateurs({ nombre_personnes: 10 }) },
                );

                expect(plan.hasChanges).to.equal(false);
                expect(plan.keptYears).to.eql([2022]);
                expect(plan.yearsToWrite).to.eql([]);
            });

            it('ignore la ligne vide d\'un doublon de rang 1 et écrit l\'autre si elle diffère du formulaire', () => {
                const plan = planMetricsUpdate(
                    [buildRow(2022), buildRow(2022, { nombre_personnes: 10 })],
                    { 2022: buildIndicateurs({ nombre_personnes: 11 }) },
                );

                expect(plan.hasChanges).to.equal(true);
                expect(plan.keptYears).to.eql([]);
                expect(plan.yearsToWrite).to.eql(['2022']);
            });

            it('réécrit toujours l\'année quand deux lignes NON vides de rang 1 existent (même avec une ligne vide en plus)', () => {
                const plan = planMetricsUpdate(
                    [buildRow(2022), buildRow(2022, { nombre_personnes: 10 }), buildRow(2022, { nombre_personnes: 10 })],
                    { 2022: buildIndicateurs({ nombre_personnes: 10 }) },
                );

                expect(plan.hasChanges).to.equal(true);
                expect(plan.keptYears).to.eql([]);
                expect(plan.yearsToWrite).to.eql(['2022']);
            });

            it('ignore une ligne vide de rang supérieur à 1', () => {
                const plan = planMetricsUpdate(
                    [buildRow(2022, { nombre_personnes: 10 }), buildRow(2021, {}, { rank: 2 })],
                    { 2022: buildIndicateurs({ nombre_personnes: 10 }) },
                );

                expect(plan.hasChanges).to.equal(false);
                expect(plan.keptYears).to.eql([2022]);
                expect(plan.yearsToWrite).to.eql([]);
            });
        });
    });

    describe('updateMetrics()', () => {
        const actionId = 7;
        const authorId = 12;
        const versionId = 55;
        const transaction = {} as any;

        function buildData(indicateurs: ActionInput['indicateurs']): ActionInput {
            return { indicateurs } as unknown as ActionInput;
        }

        function expectNoWrite(): void {
            expect(stubs.createMetricsVersion).not.to.have.been.called;
            expect(stubs.moveMetricsToVersion).not.to.have.been.called;
            expect(stubs.deleteMetricsOutsideVersion).not.to.have.been.called;
            expect(stubs.insertMetrics).not.to.have.been.called;
            expect(stubs.deleteOrphanMetricsVersions).not.to.have.been.called;
        }

        beforeEach(() => {
            stubs.fetchMetrics.resolves([]);
            stubs.createMetricsVersion.resolves(versionId);
            stubs.moveMetricsToVersion.resolves();
            stubs.deleteMetricsOutsideVersion.resolves();
            stubs.insertMetrics.resolves();
            stubs.deleteOrphanMetricsVersions.resolves();
        });

        afterEach(() => {
            sandbox.reset();
        });

        after(() => {
            sandbox.restore();
        });

        it('lit les indicateurs de l\'action avec fetchMetrics([actionId], {}, transaction)', async () => {
            await updateMetrics(actionId, authorId, buildData({}), transaction);

            expect(stubs.fetchMetrics).to.have.been.calledOnceWithExactly([actionId], {}, transaction);
        });

        describe('aucun changement', () => {
            it('n\'écrit rien (ni version, ni déplacement, ni suppression, ni insertion) quand tout est identique', async () => {
                stubs.fetchMetrics.resolves([
                    buildRow(2022, { nombre_personnes: 10 }),
                    buildRow(2023, { nombre_personnes: 20 }),
                ]);

                await updateMetrics(actionId, authorId, buildData({
                    2022: buildIndicateurs({ nombre_personnes: 10 }),
                    2023: buildIndicateurs({ nombre_personnes: 20 }),
                }), transaction);

                expectNoWrite();
            });

            it('n\'écrit rien quand seules des lignes de rang > 1 (anciennes versions) diffèrent', async () => {
                stubs.fetchMetrics.resolves([
                    buildRow(2022, { nombre_personnes: 10 }),
                    buildRow(2022, { nombre_personnes: 1 }, { rank: 2 }),
                    buildRow(2019, { nombre_personnes: 3 }, { rank: 2 }),
                ]);

                await updateMetrics(actionId, authorId, buildData({
                    2022: buildIndicateurs({ nombre_personnes: 10 }),
                }), transaction);

                expectNoWrite();
            });

            it('n\'écrit rien quand il n\'y a ni ligne ni indicateur renseigné', async () => {
                await updateMetrics(actionId, authorId, buildData({ 2022: buildIndicateurs() }), transaction);

                expectNoWrite();
            });
        });

        describe('séquence d\'écriture complète (année conservée, modifiée et ajoutée)', () => {
            const form = (): ActionInput['indicateurs'] => ({
                2022: buildIndicateurs({ nombre_personnes: 10 }),
                2023: buildIndicateurs({ nombre_personnes: 25 }),
                2024: buildIndicateurs({ nombre_personnes: 30 }),
            });

            beforeEach(() => {
                stubs.fetchMetrics.resolves([
                    buildRow(2022, { nombre_personnes: 10 }),
                    buildRow(2023, { nombre_personnes: 20 }),
                ]);
            });

            it('exécute les 5 étapes dans l\'ordre exact', async () => {
                await updateMetrics(actionId, authorId, buildData(form()), transaction);

                sinon.assert.callOrder(
                    stubs.fetchMetrics,
                    stubs.createMetricsVersion,
                    stubs.moveMetricsToVersion,
                    stubs.deleteMetricsOutsideVersion,
                    stubs.insertMetrics,
                    stubs.deleteOrphanMetricsVersions,
                );
                [
                    stubs.createMetricsVersion,
                    stubs.moveMetricsToVersion,
                    stubs.deleteMetricsOutsideVersion,
                    stubs.insertMetrics,
                    stubs.deleteOrphanMetricsVersions,
                ].forEach(stub => expect(stub).to.have.been.calledOnce);
            });

            it('crée la version avec l\'action, l\'auteur et la transaction', async () => {
                await updateMetrics(actionId, authorId, buildData(form()), transaction);

                expect(stubs.createMetricsVersion).to.have.been.calledOnceWithExactly(actionId, authorId, transaction);
            });

            it('déplace les années conservées vers la nouvelle version (id renvoyé par createMetricsVersion)', async () => {
                await updateMetrics(actionId, authorId, buildData(form()), transaction);

                expect(stubs.moveMetricsToVersion).to.have.been.calledOnceWithExactly(actionId, versionId, [2022], transaction);
            });

            it('supprime ce qui est hors de la nouvelle version', async () => {
                await updateMetrics(actionId, authorId, buildData(form()), transaction);

                expect(stubs.deleteMetricsOutsideVersion).to.have.been.calledOnceWithExactly(actionId, versionId, transaction);
            });

            it('n\'insère que les années modifiées ou ajoutées, rattachées à la nouvelle version', async () => {
                const data = buildData(form());

                await updateMetrics(actionId, authorId, data, transaction);

                expect(stubs.insertMetrics).to.have.been.calledOnce;
                const [calledActionId, calledAuthorId, calledData, calledTransaction, calledVersionId] = stubs.insertMetrics.firstCall.args;
                expect(calledActionId).to.equal(actionId);
                expect(calledAuthorId).to.equal(authorId);
                expect(Object.keys(calledData.indicateurs).sort()).to.eql(['2023', '2024']);
                expect(calledData.indicateurs['2023']).to.eql(data.indicateurs['2023']);
                expect(calledData.indicateurs['2024']).to.eql(data.indicateurs['2024']);
                expect(calledTransaction).to.equal(transaction);
                expect(calledVersionId).to.equal(versionId);
            });

            it('supprime ensuite les versions orphelines de l\'action', async () => {
                await updateMetrics(actionId, authorId, buildData(form()), transaction);

                expect(stubs.deleteOrphanMetricsVersions).to.have.been.calledOnceWithExactly(actionId, transaction);
            });

            it('utilise la même transaction pour toutes les opérations', async () => {
                await updateMetrics(actionId, authorId, buildData(form()), transaction);

                expect(stubs.fetchMetrics.firstCall.args[2]).to.equal(transaction);
                expect(stubs.createMetricsVersion.firstCall.args[2]).to.equal(transaction);
                expect(stubs.moveMetricsToVersion.firstCall.args[3]).to.equal(transaction);
                expect(stubs.deleteMetricsOutsideVersion.firstCall.args[2]).to.equal(transaction);
                expect(stubs.insertMetrics.firstCall.args[3]).to.equal(transaction);
                expect(stubs.deleteOrphanMetricsVersions.firstCall.args[1]).to.equal(transaction);
            });

            it('ne déplace que les lignes de rang 1 (les anciennes versions ne sont jamais conservées)', async () => {
                stubs.fetchMetrics.resolves([
                    buildRow(2022, { nombre_personnes: 10 }),
                    buildRow(2023, { nombre_personnes: 20 }),
                    buildRow(2021, { nombre_personnes: 7 }, { rank: 2 }),
                ]);

                await updateMetrics(actionId, authorId, buildData(form()), transaction);

                expect(stubs.moveMetricsToVersion).to.have.been.calledOnceWithExactly(actionId, versionId, [2022], transaction);
            });
        });

        describe('étapes conditionnelles', () => {
            it('n\'appelle pas moveMetricsToVersion quand aucune année n\'est conservée', async () => {
                stubs.fetchMetrics.resolves([buildRow(2022, { nombre_personnes: 10 })]);

                await updateMetrics(actionId, authorId, buildData({
                    2022: buildIndicateurs({ nombre_personnes: 11 }),
                }), transaction);

                expect(stubs.createMetricsVersion).to.have.been.calledOnce;
                expect(stubs.moveMetricsToVersion).not.to.have.been.called;
                expect(stubs.deleteMetricsOutsideVersion).to.have.been.calledOnceWithExactly(actionId, versionId, transaction);
                expect(stubs.insertMetrics).to.have.been.calledOnce;
                expect(stubs.deleteOrphanMetricsVersions).to.have.been.calledOnce;
            });

            it('n\'appelle pas insertMetrics quand il n\'y a rien à écrire (année retirée, autre année conservée)', async () => {
                stubs.fetchMetrics.resolves([
                    buildRow(2022, { nombre_personnes: 10 }),
                    buildRow(2023, { nombre_personnes: 20 }),
                ]);

                await updateMetrics(actionId, authorId, buildData({
                    2023: buildIndicateurs({ nombre_personnes: 20 }),
                }), transaction);

                expect(stubs.createMetricsVersion).to.have.been.calledOnce;
                expect(stubs.moveMetricsToVersion).to.have.been.calledOnceWithExactly(actionId, versionId, [2023], transaction);
                expect(stubs.deleteMetricsOutsideVersion).to.have.been.calledOnce;
                expect(stubs.insertMetrics).not.to.have.been.called;
                expect(stubs.deleteOrphanMetricsVersions).to.have.been.calledOnce;
            });

            it('appelle deleteMetricsOutsideVersion même quand aucune ligne n\'existe (ajout pur)', async () => {
                await updateMetrics(actionId, authorId, buildData({
                    2024: buildIndicateurs({ nombre_personnes: 30 }),
                }), transaction);

                expect(stubs.moveMetricsToVersion).not.to.have.been.called;
                expect(stubs.deleteMetricsOutsideVersion).to.have.been.calledOnceWithExactly(actionId, versionId, transaction);
                expect(Object.keys(stubs.insertMetrics.firstCall.args[2].indicateurs)).to.eql(['2024']);
            });

            it('n\'insère pas une année vidée (aucune valeur) présente dans le formulaire', async () => {
                stubs.fetchMetrics.resolves([buildRow(2022, { nombre_personnes: 10 })]);

                await updateMetrics(actionId, authorId, buildData({
                    2022: buildIndicateurs({ nombre_personnes: 10 }),
                    2023: buildIndicateurs(),
                }), transaction);

                expectNoWrite();
            });
        });

        describe('toutes les années retirées', () => {
            it('crée une version, supprime tout, ne déplace ni n\'insère rien, puis supprime les versions orphelines', async () => {
                stubs.fetchMetrics.resolves([
                    buildRow(2022, { nombre_personnes: 10 }),
                    buildRow(2023, { nombre_personnes: 20 }),
                ]);

                await updateMetrics(actionId, authorId, buildData({}), transaction);

                expect(stubs.createMetricsVersion).to.have.been.calledOnceWithExactly(actionId, authorId, transaction);
                expect(stubs.moveMetricsToVersion).not.to.have.been.called;
                expect(stubs.deleteMetricsOutsideVersion).to.have.been.calledOnceWithExactly(actionId, versionId, transaction);
                expect(stubs.insertMetrics).not.to.have.been.called;
                expect(stubs.deleteOrphanMetricsVersions).to.have.been.calledOnceWithExactly(actionId, transaction);
                sinon.assert.callOrder(
                    stubs.createMetricsVersion,
                    stubs.deleteMetricsOutsideVersion,
                    stubs.deleteOrphanMetricsVersions,
                );
            });

            it('suit le même chemin quand les années sont vidées plutôt qu\'absentes', async () => {
                stubs.fetchMetrics.resolves([buildRow(2022, { nombre_personnes: 10 })]);

                await updateMetrics(actionId, authorId, buildData({ 2022: buildIndicateurs() }), transaction);

                expect(stubs.createMetricsVersion).to.have.been.calledOnce;
                expect(stubs.deleteMetricsOutsideVersion).to.have.been.calledOnce;
                expect(stubs.deleteOrphanMetricsVersions).to.have.been.calledOnce;
                expect(stubs.insertMetrics).not.to.have.been.called;
            });
        });

        describe('doublon d\'année en rang 1', () => {
            it('réécrit l\'année (non déplacée) dans la nouvelle version', async () => {
                stubs.fetchMetrics.resolves([
                    buildRow(2022, { nombre_personnes: 10 }),
                    buildRow(2022, { nombre_personnes: 10 }),
                ]);

                await updateMetrics(actionId, authorId, buildData({
                    2022: buildIndicateurs({ nombre_personnes: 10 }),
                }), transaction);

                expect(stubs.moveMetricsToVersion).not.to.have.been.called;
                expect(Object.keys(stubs.insertMetrics.firstCall.args[2].indicateurs)).to.eql(['2022']);
                expect(stubs.insertMetrics.firstCall.args[4]).to.equal(versionId);
            });
        });

        describe('lignes de rang 1 entièrement vides', () => {
            it('n\'écrit rien quand seule une ligne vide existe et que le formulaire ne l\'envoie pas', async () => {
                stubs.fetchMetrics.resolves([buildRow(2022)]);

                await updateMetrics(actionId, authorId, buildData({}), transaction);

                expectNoWrite();
            });

            it('n\'écrit rien quand une ligne vide existe à côté d\'années identiques au formulaire', async () => {
                stubs.fetchMetrics.resolves([buildRow(2021), buildRow(2022, { nombre_personnes: 10 })]);

                await updateMetrics(actionId, authorId, buildData({
                    2022: buildIndicateurs({ nombre_personnes: 10 }),
                }), transaction);

                expectNoWrite();
            });

            it('ne déplace pas l\'année de la ligne vide quand une autre année est modifiée', async () => {
                stubs.fetchMetrics.resolves([
                    buildRow(2021),
                    buildRow(2022, { nombre_personnes: 10 }),
                    buildRow(2023, { nombre_personnes: 20 }),
                ]);

                await updateMetrics(actionId, authorId, buildData({
                    2022: buildIndicateurs({ nombre_personnes: 10 }),
                    2023: buildIndicateurs({ nombre_personnes: 25 }),
                }), transaction);

                expect(stubs.moveMetricsToVersion).to.have.been.calledOnceWithExactly(actionId, versionId, [2022], transaction);
                expect(Object.keys(stubs.insertMetrics.firstCall.args[2].indicateurs)).to.eql(['2023']);
            });
        });

        describe('propagation des erreurs', () => {
            const writeScenario = (): void => {
                stubs.fetchMetrics.resolves([
                    buildRow(2022, { nombre_personnes: 10 }),
                    buildRow(2023, { nombre_personnes: 20 }),
                ]);
            };
            const writeForm = (): ActionInput => buildData({
                2022: buildIndicateurs({ nombre_personnes: 10 }),
                2023: buildIndicateurs({ nombre_personnes: 25 }),
                2024: buildIndicateurs({ nombre_personnes: 30 }),
            });

            const steps: { name: string, stub: () => sinon.SinonStub, following: (() => sinon.SinonStub)[] }[] = [
                {
                    name: 'fetchMetrics',
                    stub: () => stubs.fetchMetrics,
                    following: [
                        () => stubs.createMetricsVersion,
                        () => stubs.moveMetricsToVersion,
                        () => stubs.deleteMetricsOutsideVersion,
                        () => stubs.insertMetrics,
                        () => stubs.deleteOrphanMetricsVersions,
                    ],
                },
                {
                    name: 'createMetricsVersion',
                    stub: () => stubs.createMetricsVersion,
                    following: [
                        () => stubs.moveMetricsToVersion,
                        () => stubs.deleteMetricsOutsideVersion,
                        () => stubs.insertMetrics,
                        () => stubs.deleteOrphanMetricsVersions,
                    ],
                },
                {
                    name: 'moveMetricsToVersion',
                    stub: () => stubs.moveMetricsToVersion,
                    following: [
                        () => stubs.deleteMetricsOutsideVersion,
                        () => stubs.insertMetrics,
                        () => stubs.deleteOrphanMetricsVersions,
                    ],
                },
                {
                    name: 'deleteMetricsOutsideVersion',
                    stub: () => stubs.deleteMetricsOutsideVersion,
                    following: [
                        () => stubs.insertMetrics,
                        () => stubs.deleteOrphanMetricsVersions,
                    ],
                },
                {
                    name: 'insertMetrics',
                    stub: () => stubs.insertMetrics,
                    following: [
                        () => stubs.deleteOrphanMetricsVersions,
                    ],
                },
                {
                    name: 'deleteOrphanMetricsVersions',
                    stub: () => stubs.deleteOrphanMetricsVersions,
                    following: [],
                },
            ];

            steps.forEach(({ name, stub, following }) => {
                it(`propage l'erreur de ${name} et n'exécute pas les étapes suivantes`, async () => {
                    writeScenario();
                    stub().rejects(new Error(`boom ${name}`));

                    try {
                        await updateMetrics(actionId, authorId, writeForm(), transaction);
                        expect.fail('aurait dû lever une erreur');
                    } catch (error) {
                        expect((error as Error).message).to.equal(`boom ${name}`);
                    }

                    following.forEach(next => expect(next()).not.to.have.been.called);
                });
            });
        });
    });
});
