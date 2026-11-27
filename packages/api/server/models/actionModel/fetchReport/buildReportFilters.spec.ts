import { expect } from 'chai';

import buildReportFilters from './buildReportFilters';
import { ReportFilters } from './ReportFilters.d';

/**
 * Contrat testé : `fetchReport/buildReportFilters.ts` (fonction pure, sans I/O)
 *
 *   export default function buildReportFilters(filters: ReportFilters, now: Date)
 *       : { where: string[], replacements: Record<string, unknown> }
 *
 * Le type `ReportFilters` est exporté par `fetchReport/ReportFilters.d.ts`.
 *
 * Reproduit côté SQL la sémantique de `webapp/src/utils/filterActions.js`.
 *
 * CHOIX (alias et tables, tirés de `fetchReport.ts` et de `fetch/fetch*.ts`) :
 *  - requête principale : `actions` (action_id, name, ended_at, location_type), `d` (departements), `r` (regions) ;
 *  - thématiques     : table `action_topics` (fk_action, fk_topic = uid de la thématique) ;
 *  - opérateurs      : tables `action_operators` (fk_action, fk_user) -> `users` (fk_organization, anonymized_at)
 *                      -> `organizations` (organization_id, name, abbreviation) ;
 *  - gestionnaires   : tables `action_managers` (fk_action, fk_user) -> `users` -> `organizations` ;
 *  - financements    : table `action_finances` (fk_action, fk_action_finance_type = 'dedie', year).
 *  - Chaque filtre actif produit UN fragment autonome (parenthésé s'il contient un OR), les fragments sont destinés
 *    à être joints par AND. Les sous-requêtes sont des `EXISTS (SELECT 1 FROM ... WHERE ...fk_action = actions.action_id)`.
 *  - Tous les paramètres sont des remplacements nommés préfixés par `filter_` (pas de collision avec `annee`,
 *    `action_*` et `finance_*` déjà utilisés par fetchReport) ; aucune valeur saisie n'est interpolée dans le SQL.
 *  - ATTENTION : `fetchReport.ts` définit une CTE nommée `action_operators` qui masque la vraie table dans la requête
 *    principale ; l'implémentation doit la renommer (vérifié dans fetchReport.filters.spec.ts).
 *  - Ce que le front fait réellement de `location` : `action.location` ne porte que `region` et `departement`
 *    (`city` et `epci` valent toujours null, cf. fetch/hashActions.ts) et `main` n'existe pas pour eux. Donc :
 *      region -> r.code = code ; departement -> d.code = code ; epci / city / autre typeUid inconnu -> aucune action
 *      (fragment `FALSE`, comme le front) ; `nation` -> pas de filtre géographique.
 */
const NOW = new Date(2026, 10, 26, 14, 30, 0, 0);
const HOSTILE = '\'; DROP TABLE x; --';

function normalize(sql: string): string {
    return sql.replace(/\s+/g, ' ').trim();
}

function build(filters: ReportFilters, now: Date = NOW) {
    const { where, replacements } = buildReportFilters(filters, now);
    return { where: where.map(normalize), replacements };
}

// Vrai si la première parenthèse ouvrante est refermée par la dernière (fragment sûr à joindre par AND).
function isWrapped(fragment: string): boolean {
    if (!fragment.startsWith('(') || !fragment.endsWith(')')) {
        return false;
    }
    let depth = 0;
    for (let i = 0; i < fragment.length; i += 1) {
        if (fragment[i] === '(') {
            depth += 1;
        } else if (fragment[i] === ')') {
            depth -= 1;
            if (depth === 0 && i < fragment.length - 1) {
                return false;
            }
        }
    }
    return depth === 0;
}

function namedParameters(sql: string): string[] {
    return Array.from(sql.matchAll(/(?<![:\w]):([A-Za-z_]\w*)/g)).map(match => match[1]);
}

describe('models/actionModel/fetchReport/buildReportFilters()', () => {
    describe('sans filtre actif', () => {
        it('renvoie un where vide et aucun remplacement pour un objet vide', () => {
            expect(build({})).to.deep.equal({ where: [], replacements: {} });
        });

        it('ignore les listes vides, la recherche vide et la localisation nulle', () => {
            const result = build({
                search: '',
                location: null,
                topic: [],
                interventionLocation: [],
                dihalFinancing: [],
            });

            expect(result).to.deep.equal({ where: [], replacements: {} });
        });
    });

    describe('status', () => {
        // Scénario « fin aujourd'hui » : `actions.ended_at` est une colonne DATEONLY. Comparer directement
        // `:filter_now < actions.ended_at` fait convertir `now` en `date` par PostgreSQL, qui tronque l'heure : une
        // action finissant aujourd'hui n'est alors ni « open » ni « closed ». Le front (`filterActions.js`,
        // `checkStatus`) compare `now` (ms) à `ended_at` converti en minuit UTC. Le SQL doit donc caster la colonne en
        // instant UTC et `:filter_now` en timestamptz. Ces tests ne vérifient que le TEXTE du SQL : l'exécution
        // réelle (jour de `ended_at`, fuseau de la session) reste à vérifier sur base.
        const ENDED_AT_AS_UTC_INSTANT = /\(?\s*actions\.ended_at::timestamp\s+AT\s+TIME\s+ZONE\s+'UTC'\s*\)?/i;
        const NOW_AS_TIMESTAMPTZ = /CAST\(\s*:filter_now\s+AS\s+timestamptz\s*\)/i;

        ['open', 'closed'].forEach((status) => {
            describe(`${status} : comparaison en instant UTC`, () => {
                const sql = () => build({ status: status as 'open' | 'closed' }).where[0];

                it('convertit la colonne ended_at en instant UTC', () => {
                    expect(sql()).to.match(ENDED_AT_AS_UTC_INSTANT);
                });

                it('convertit :filter_now en timestamptz', () => {
                    expect(sql()).to.match(NOW_AS_TIMESTAMPTZ);
                });

                it('ne compare plus :filter_now directement à actions.ended_at', () => {
                    expect(sql()).to.not.match(/:filter_now\s*[<>]=?\s*actions\.ended_at/);
                    expect(sql()).to.not.match(/actions\.ended_at\s*[<>]=?\s*:filter_now/);
                });
            });
        });

        it('open : ended_at NULL ou instant UTC de ended_at strictement postérieur à now', () => {
            const sql = build({ status: 'open' }).where[0];

            expect(sql).to.match(/actions\.ended_at IS NULL OR/);
            expect(sql).to.match(/AT\s+TIME\s+ZONE\s+'UTC'\s*\)?\s*>\s*CAST\(\s*:filter_now\s+AS\s+timestamptz\s*\)/i);
            expect(isWrapped(sql)).to.equal(true);
        });

        it('closed : ended_at non NULL et instant UTC de ended_at strictement antérieur à now', () => {
            const sql = build({ status: 'closed' }).where[0];

            expect(sql).to.match(/actions\.ended_at IS NOT NULL AND/);
            expect(sql).to.match(/AT\s+TIME\s+ZONE\s+'UTC'\s*\)?\s*<\s*CAST\(\s*:filter_now\s+AS\s+timestamptz\s*\)/i);
            expect(isWrapped(sql)).to.equal(true);
        });

        it('open : action sans date de fin ou dont la fin est strictement postérieure à now', () => {
            const { where, replacements } = build({ status: 'open' });

            expect(where).to.have.lengthOf(1);
            expect(where[0]).to.match(/actions\.ended_at IS NULL OR/);
            expect(isWrapped(where[0])).to.equal(true);
            expect(replacements).to.deep.equal({ filter_now: NOW });
        });

        it('closed : action avec une date de fin strictement antérieure à now', () => {
            const { where, replacements } = build({ status: 'closed' });

            expect(where).to.have.lengthOf(1);
            expect(where[0]).to.match(/actions\.ended_at IS NOT NULL AND/);
            expect(isWrapped(where[0])).to.equal(true);
            expect(replacements).to.deep.equal({ filter_now: NOW });
        });

        it('compare strictement : ni <= ni >= (une action terminée exactement à now n\'est ni ouverte ni terminée)', () => {
            const open = build({ status: 'open' }).where[0];
            const closed = build({ status: 'closed' }).where[0];

            expect(open).to.not.match(/<=|>=/);
            expect(closed).to.not.match(/<=|>=/);
        });

        it('utilise la date passée en paramètre et jamais NOW() / CURRENT_TIMESTAMP dans le SQL', () => {
            const otherNow = new Date(2030, 0, 1);
            const { where, replacements } = build({ status: 'open' }, otherNow);

            expect(replacements.filter_now).to.equal(otherNow);
            expect(where.join(' ')).to.not.match(/now\s*\(|current_timestamp|current_date/i);
        });

        it('n\'ajoute pas de remplacement filter_now quand aucun statut n\'est demandé', () => {
            const { replacements } = build({ topic: ['health'] });

            expect(replacements).to.not.have.property('filter_now');
        });
    });

    describe('topic', () => {
        it('exige au moins une thématique de l\'action parmi les uid demandés', () => {
            const { where, replacements } = build({ topic: ['health', 'school'] });

            expect(where).to.have.lengthOf(1);
            expect(where[0]).to.match(/^EXISTS \(SELECT 1 FROM action_topics WHERE /);
            expect(where[0]).to.include('action_topics.fk_action = actions.action_id');
            expect(where[0]).to.include('action_topics.fk_topic IN (:filter_topic)');
            expect(replacements).to.deep.equal({ filter_topic: ['health', 'school'] });
        });
    });

    describe('interventionLocation', () => {
        it('conserve les actions dont location_type est dans les valeurs', () => {
            const { where, replacements } = build({ interventionLocation: ['eti', 'sur_site'] });

            expect(where).to.deep.equal(['actions.location_type IN (:filter_intervention_location)']);
            expect(replacements).to.deep.equal({ filter_intervention_location: ['eti', 'sur_site'] });
        });
    });

    describe('dihalFinancing', () => {
        it('"all" : au moins une ligne de financement de type dedie, toute année (pas de filtre d\'année)', () => {
            const { where, replacements } = build({ dihalFinancing: ['all'] });

            expect(where).to.have.lengthOf(1);
            expect(where[0]).to.match(/^EXISTS \(SELECT 1 FROM action_finances WHERE /);
            expect(where[0]).to.include('action_finances.fk_action = actions.action_id');
            expect(where[0]).to.include('action_finances.fk_action_finance_type = \'dedie\'');
            expect(where[0]).to.not.match(/year/i);
            expect(replacements).to.deep.equal({});
        });

        it('"all" mêlé à des années : l\'année est ignorée (comme le front), toute année compte', () => {
            const { where, replacements } = build({ dihalFinancing: ['2024', 'all'] });

            expect(where[0]).to.not.match(/year/i);
            expect(replacements).to.deep.equal({});
        });

        it('années données : au moins une ligne dedie sur l\'une de ces années', () => {
            const { where, replacements } = build({ dihalFinancing: ['2024', '2025'] });

            expect(where).to.have.lengthOf(1);
            expect(where[0]).to.include('action_finances.fk_action = actions.action_id');
            expect(where[0]).to.include('action_finances.fk_action_finance_type = \'dedie\'');
            expect(where[0]).to.include('action_finances.year IN (:filter_dihal_years)');
            expect(replacements).to.deep.equal({ filter_dihal_years: ['2024', '2025'] });
        });
    });

    describe('organizationId (onglet « Ma structure »)', () => {
        it('exige une structure parmi les utilisateurs (non anonymisés) des opérateurs de l\'action', () => {
            const { where, replacements } = build({ organizationId: 12 });

            expect(where).to.have.lengthOf(1);
            expect(where[0]).to.match(/^EXISTS \(SELECT 1 FROM action_operators /);
            expect(where[0]).to.include('JOIN users ON users.user_id = action_operators.fk_user');
            expect(where[0]).to.include('action_operators.fk_action = actions.action_id');
            expect(where[0]).to.include('users.fk_organization = :filter_organization_id');
            expect(where[0]).to.include('users.anonymized_at IS NULL');
            expect(replacements).to.deep.equal({ filter_organization_id: 12 });
        });
    });

    describe('location', () => {
        it('organization : l\'opérateur d\'id location.organizationId, sans filtre géographique', () => {
            const { where, replacements } = build({
                location: { type: 'organization', typeUid: 'organization', organizationId: 7 },
            });

            expect(where).to.have.lengthOf(1);
            expect(where[0]).to.match(/^EXISTS \(SELECT 1 FROM action_operators /);
            expect(where[0]).to.include('action_operators.fk_action = actions.action_id');
            expect(where[0]).to.include('users.fk_organization = :filter_location_organization_id');
            expect(where[0]).to.not.match(/\b(d|r)\.code/);
            expect(replacements).to.deep.equal({ filter_location_organization_id: 7 });
        });

        it('organization + organizationId : deux fragments indépendants avec des remplacements distincts', () => {
            const { where, replacements } = build({
                organizationId: 12,
                location: { type: 'organization', typeUid: 'organization', organizationId: 7 },
            });

            expect(where).to.have.lengthOf(2);
            expect(replacements).to.deep.equal({ filter_organization_id: 12, filter_location_organization_id: 7 });
        });

        it('metropole : exclut les régions d\'outre-mer 01, 02, 03, 04 et 06', () => {
            const { where, replacements } = build({ location: { typeUid: 'metropole' } });

            expect(where).to.deep.equal(['r.code NOT IN (:filter_overseas_regions)']);
            expect(replacements).to.deep.equal({ filter_overseas_regions: ['01', '02', '03', '04', '06'] });
        });

        it('outremer : conserve uniquement les régions 01, 02, 03, 04 et 06', () => {
            const { where, replacements } = build({ location: { typeUid: 'outremer' } });

            expect(where).to.deep.equal(['r.code IN (:filter_overseas_regions)']);
            expect(replacements).to.deep.equal({ filter_overseas_regions: ['01', '02', '03', '04', '06'] });
        });

        it('region : code de la région', () => {
            const { where, replacements } = build({ location: { type: 'region', typeUid: 'region', code: '11' } });

            expect(where).to.deep.equal(['r.code = :filter_location_code']);
            expect(replacements).to.deep.equal({ filter_location_code: '11' });
        });

        it('departement : code du département', () => {
            const { where, replacements } = build({ location: { type: 'departement', typeUid: 'departement', code: '75' } });

            expect(where).to.deep.equal(['d.code = :filter_location_code']);
            expect(replacements).to.deep.equal({ filter_location_code: '75' });
        });

        it('convertit le code en chaîne (le front compare le code converti en texte)', () => {
            const { replacements } = build({
                location: { typeUid: 'departement', code: 75 as unknown as string },
            });

            expect(replacements.filter_location_code).to.equal('75');
        });

        ['epci', 'city'].forEach((typeUid) => {
            it(`${typeUid} : n'est pas porté par action.location côté front, aucune action ne correspond (FALSE)`, () => {
                const { where, replacements } = build({ location: { typeUid, code: '12345' } });

                expect(where).to.deep.equal(['FALSE']);
                expect(replacements).to.deep.equal({});
            });
        });

        it('typeUid inconnu : aucune action ne correspond (FALSE), la valeur n\'est pas injectée dans le SQL', () => {
            const { where } = build({ location: { typeUid: HOSTILE, code: '1' } });

            expect(where).to.deep.equal(['FALSE']);
        });

        it('nation : pas de filtre géographique', () => {
            expect(build({ location: { typeUid: 'nation' } })).to.deep.equal({ where: [], replacements: {} });
        });
    });

    describe('search', () => {
        it('recherche insensible à la casse sur le nom de l\'action, les noms/abréviations des opérateurs et des gestionnaires', () => {
            const { where, replacements } = build({ search: 'Abri' });

            expect(where).to.have.lengthOf(1);
            const [fragment] = where;
            expect(isWrapped(fragment)).to.equal(true);
            expect(fragment).to.include('actions.name ILIKE :filter_search');
            expect(fragment).to.include('FROM action_operators');
            expect(fragment).to.include('FROM action_managers');
            expect(fragment).to.include('organizations.name ILIKE :filter_search');
            expect(fragment).to.include('organizations.abbreviation ILIKE :filter_search');
            expect(fragment.match(/action_operators\.fk_action = actions\.action_id/g)).to.have.lengthOf(1);
            expect(fragment.match(/action_managers\.fk_action = actions\.action_id/g)).to.have.lengthOf(1);
            expect(replacements).to.deep.equal({ filter_search: '%Abri%' });
        });

        it('n\'utilise aucun opérateur d\'expression régulière (la saisie est un texte littéral)', () => {
            const { where } = build({ search: 'a.b' });

            expect(where.join(' ')).to.not.match(/ ~\*? |~\*|SIMILAR TO|REGEXP|regexp_/i);
        });

        it('ne traite pas "." comme un joker : "a.b" reste "a.b"', () => {
            expect(build({ search: 'a.b' }).replacements).to.deep.equal({ filter_search: '%a.b%' });
        });

        it('échappe %, _ et \\ pour ILIKE', () => {
            expect(build({ search: '100%' }).replacements.filter_search).to.equal('%100\\%%');
            expect(build({ search: 'a_b' }).replacements.filter_search).to.equal('%a\\_b%');
            expect(build({ search: 'a\\b' }).replacements.filter_search).to.equal('%a\\\\b%');
            expect(build({ search: '%_\\' }).replacements.filter_search).to.equal('%\\%\\_\\\\%');
        });

        it('est ignorée quand une localisation géographique est active', () => {
            const { where, replacements } = build({
                search: 'Abri',
                location: { typeUid: 'departement', code: '75' },
            });

            expect(where).to.deep.equal(['d.code = :filter_location_code']);
            expect(replacements).to.not.have.property('filter_search');
        });

        it('est aussi ignorée quand la localisation est une structure', () => {
            const { replacements } = build({
                search: 'Abri',
                location: { type: 'organization', typeUid: 'organization', organizationId: 7 },
            });

            expect(replacements).to.not.have.property('filter_search');
        });
    });

    describe('combinaison', () => {
        const ALL: ReportFilters = {
            status: 'open',
            search: 'Abri',
            organizationId: 12,
            topic: ['health'],
            interventionLocation: ['eti'],
            dihalFinancing: ['2025'],
        };

        it('produit un fragment par filtre actif (ET implicite) sans doublon', () => {
            const { where } = build(ALL);

            // statut, recherche, structure, thématique, lieu d'intervention, financement
            expect(where).to.have.lengthOf(6);
        });

        it('chaque fragment contenant un OR est parenthésé, donc sûr à joindre par AND', () => {
            const { where } = build({ ...ALL, location: null });

            where.filter(fragment => / OR /.test(fragment)).forEach((fragment) => {
                expect(isWrapped(fragment), fragment).to.equal(true);
            });
        });

        it('toute valeur du SQL est un remplacement nommé existant, et chaque remplacement est utilisé', () => {
            const { where, replacements } = build(ALL);
            const used = new Set(namedParameters(where.join(' ')));

            expect(Array.from(used).sort()).to.deep.equal(Object.keys(replacements).sort());
        });

        it('tous les remplacements sont préfixés par filter_ (pas de collision avec annee, action_*, finance_*)', () => {
            const { replacements } = build({
                ...ALL,
                search: 'x',
                location: undefined,
            });

            Object.keys(replacements).forEach((key) => {
                expect(key).to.match(/^filter_/);
            });
        });
    });

    describe('injection SQL', () => {
        it('une valeur hostile n\'apparaît que dans les remplacements, jamais dans le SQL', () => {
            const cases: ReportFilters[] = [
                { search: HOSTILE },
                { topic: [HOSTILE] },
                { interventionLocation: [HOSTILE] },
                { dihalFinancing: [HOSTILE] },
                { location: { typeUid: 'departement', code: HOSTILE } },
                { location: { typeUid: HOSTILE, code: HOSTILE } },
            ];

            cases.forEach((filters) => {
                const { where } = build(filters);
                const sql = where.join(' ');

                expect(sql, JSON.stringify(filters)).to.not.include('DROP');
                expect(sql, JSON.stringify(filters)).to.not.include('--');
                expect(sql, JSON.stringify(filters)).to.not.include('\'; ');
            });
        });

        it('retrouve la valeur hostile dans les remplacements', () => {
            expect(JSON.stringify(build({ topic: [HOSTILE] }).replacements)).to.include('DROP TABLE x');
            expect(JSON.stringify(build({ interventionLocation: [HOSTILE] }).replacements)).to.include('DROP TABLE x');
            expect(JSON.stringify(build({ dihalFinancing: [HOSTILE] }).replacements)).to.include('DROP TABLE x');
            expect(JSON.stringify(build({ search: HOSTILE }).replacements)).to.include('DROP TABLE x');
            expect(JSON.stringify(build({ location: { typeUid: 'region', code: HOSTILE } }).replacements)).to.include('DROP TABLE x');
        });
    });
});
