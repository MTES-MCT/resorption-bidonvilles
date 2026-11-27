import { expect } from 'chai';
import { validationResult } from 'express-validator';

import validators, { extractReportFilters } from './action.exportList.validator';

/**
 * Contrat testé : `controllers/action/exportList/action.exportList.validator.ts`
 *
 * POINT D'ACCÈS CHOISI :
 *  - export par défaut : tableau de chaînes de validation express-validator (`query(...)`), à brancher sur la route
 *    (`app.customRoutes.get('/actions/export/excel/:year', controller, validator, ...)`). Il VALIDE puis NORMALISE
 *    `req.query` en place (entiers convertis, listes toujours en tableaux de chaînes, chaînes vides retirées) ;
 *  - export nommé `extractReportFilters(query): ReportFilters` : fonction pure appelée par le controller sur
 *    `req.query` déjà validé pour construire l'objet passé à `exportActions(user, year, filters)`.
 *    Elle n'inclut JAMAIS de clé à `undefined` (clé absente = filtre inactif).
 *
 * Règles de validation (paramètres de requête) :
 *  - status : `open` | `closed`, optionnel ;
 *  - search : chaîne de 200 caractères maximum ; vide = absent ;
 *  - locationType : chaîne [a-z_], 30 caractères maximum ;
 *  - locationTypeUid : parmi nation, metropole, outremer, region, departement, epci, city, organization ;
 *  - locationCode : alphanumérique, 10 caractères maximum, obligatoire pour region / departement / epci / city ;
 *  - locationOrganizationId : entier, obligatoire pour locationTypeUid = organization ;
 *  - organizationId : entier ;
 *  - topic, interventionLocation : valeur unique ou tableau, chaînes alphanumériques/underscore de 50 max ;
 *  - dihalFinancing : valeur unique ou tableau ; chaque valeur est `all` ou une année à 4 chiffres ;
 *  - un paramètre scalaire envoyé en tableau (?status=a&status=b) ou en objet est rejeté (type confusion CodeQL).
 */
type Query = Record<string, unknown>;

// `year` est un paramètre de route (`/actions/export/excel/:year`) : toujours présent, valide par défaut
async function runValidators(query: Query, params: Query = { year: '2025' }) {
    const req: { query: Query, body: Query, params: Query } = { query: { ...query }, body: {}, params: { ...params } };
    await validators.reduce(
        (previous, validator) => previous.then(() => validator.run(req)),
        Promise.resolve(),
    );

    return { errors: validationResult(req).array(), query: req.query };
}

const messagesInError = (errors: { msg?: string }[]): string[] => errors.map(error => error.msg);

const paramsInError = (errors: { param?: string, path?: string }[]): string[] => errors.map(error => error.param ?? error.path);

describe('controllers/action/exportList/action.exportList.validator', () => {
    describe('requête sans filtre', () => {
        it('est valide et n\'ajoute aucun filtre', async () => {
            const { errors, query } = await runValidators({});

            expect(errors).to.deep.equal([]);
            expect(extractReportFilters(query)).to.deep.equal({});
        });
    });

    describe('status', () => {
        ['open', 'closed'].forEach((status) => {
            it(`accepte "${status}"`, async () => {
                const { errors, query } = await runValidators({ status });

                expect(errors).to.deep.equal([]);
                expect(extractReportFilters(query)).to.deep.equal({ status });
            });
        });

        it('rejette une valeur inconnue', async () => {
            const { errors } = await runValidators({ status: 'myOrganization' });

            expect(paramsInError(errors)).to.include('status');
        });

        it('rejette un statut envoyé plusieurs fois', async () => {
            const { errors } = await runValidators({ status: ['open', 'closed'] });

            expect(paramsInError(errors)).to.include('status');
        });
    });

    describe('search', () => {
        it('accepte une saisie libre (caractères spéciaux compris, ils sont traités comme du texte par le modèle)', async () => {
            const { errors, query } = await runValidators({ search: 'Abri 100% (a.b)_x' });

            expect(errors).to.deep.equal([]);
            expect(extractReportFilters(query)).to.deep.equal({ search: 'Abri 100% (a.b)_x' });
        });

        it('traite une chaîne vide comme absente', async () => {
            const { errors, query } = await runValidators({ search: '' });

            expect(errors).to.deep.equal([]);
            expect(extractReportFilters(query)).to.not.have.property('search');
        });

        it('accepte 200 caractères', async () => {
            const { errors } = await runValidators({ search: 'a'.repeat(200) });

            expect(errors).to.deep.equal([]);
        });

        it('rejette plus de 200 caractères', async () => {
            const { errors } = await runValidators({ search: 'a'.repeat(201) });

            expect(paramsInError(errors)).to.include('search');
        });

        it('rejette une recherche envoyée plusieurs fois (tableau) et un objet', async () => {
            expect(paramsInError((await runValidators({ search: ['a', 'b'] })).errors)).to.include('search');
            expect(paramsInError((await runValidators({ search: { a: 'b' } })).errors)).to.include('search');
        });
    });

    describe('localisation', () => {
        it('construit la localisation d\'un département', async () => {
            const { errors, query } = await runValidators({
                locationType: 'departement', locationTypeUid: 'departement', locationCode: '75',
            });

            expect(errors).to.deep.equal([]);
            expect(extractReportFilters(query)).to.deep.equal({
                location: { type: 'departement', typeUid: 'departement', code: '75' },
            });
        });

        it('utilise locationTypeUid comme type quand locationType est absent', async () => {
            const { errors, query } = await runValidators({ locationTypeUid: 'region', locationCode: '11' });

            expect(errors).to.deep.equal([]);
            expect(extractReportFilters(query)).to.deep.equal({
                location: { type: 'region', typeUid: 'region', code: '11' },
            });
        });

        it('accepte les codes alphanumériques (2A, code INSEE)', async () => {
            expect((await runValidators({ locationTypeUid: 'departement', locationCode: '2A' })).errors).to.deep.equal([]);
            expect((await runValidators({ locationTypeUid: 'city', locationCode: '75056' })).errors).to.deep.equal([]);
        });

        ['metropole', 'outremer', 'nation'].forEach((typeUid) => {
            it(`accepte ${typeUid} sans code`, async () => {
                const { errors, query } = await runValidators({ locationTypeUid: typeUid });

                expect(errors).to.deep.equal([]);
                expect(extractReportFilters(query)).to.deep.equal({ location: { type: typeUid, typeUid } });
            });
        });

        it('construit la localisation « structure » avec locationOrganizationId converti en entier', async () => {
            const { errors, query } = await runValidators({
                locationType: 'organization', locationTypeUid: 'organization', locationOrganizationId: '7',
            });

            expect(errors).to.deep.equal([]);
            expect(extractReportFilters(query)).to.deep.equal({
                location: { type: 'organization', typeUid: 'organization', organizationId: 7 },
            });
        });

        it('rejette un locationTypeUid inconnu', async () => {
            const { errors } = await runValidators({ locationTypeUid: 'planete', locationCode: '1' });

            expect(paramsInError(errors)).to.include('locationTypeUid');
        });

        ['region', 'departement', 'epci', 'city'].forEach((typeUid) => {
            it(`rejette ${typeUid} sans locationCode`, async () => {
                const { errors } = await runValidators({ locationTypeUid: typeUid });

                expect(paramsInError(errors)).to.include('locationCode');
            });
        });

        it('rejette organization sans locationOrganizationId', async () => {
            const { errors } = await runValidators({ locationTypeUid: 'organization' });

            expect(paramsInError(errors)).to.include('locationOrganizationId');
        });

        it('rejette un locationCode non alphanumérique ou trop long', async () => {
            expect(paramsInError((await runValidators({ locationTypeUid: 'departement', locationCode: '7\'; --' })).errors))
                .to.include('locationCode');
            expect(paramsInError((await runValidators({ locationTypeUid: 'departement', locationCode: '12345678901' })).errors))
                .to.include('locationCode');
        });

        it('rejette locationOrganizationId non entier', async () => {
            const { errors } = await runValidators({ locationTypeUid: 'organization', locationOrganizationId: 'abc' });

            expect(paramsInError(errors)).to.include('locationOrganizationId');
        });

        it('rejette un locationType invalide', async () => {
            const { errors } = await runValidators({ locationType: 'a'.repeat(31), locationTypeUid: 'metropole' });

            expect(paramsInError(errors)).to.include('locationType');
        });

        it('rejette locationType, locationTypeUid et locationCode envoyés en tableau', async () => {
            const { errors } = await runValidators({
                locationType: ['a', 'b'], locationTypeUid: ['region', 'departement'], locationCode: ['75', '76'],
            });

            expect(paramsInError(errors)).to.include.members(['locationType', 'locationTypeUid', 'locationCode']);
        });
    });

    describe('organizationId', () => {
        it('convertit un entier valide', async () => {
            const { errors, query } = await runValidators({ organizationId: '12' });

            expect(errors).to.deep.equal([]);
            expect(extractReportFilters(query)).to.deep.equal({ organizationId: 12 });
        });

        it('rejette une valeur non entière ou un tableau', async () => {
            expect(paramsInError((await runValidators({ organizationId: 'abc' })).errors)).to.include('organizationId');
            expect(paramsInError((await runValidators({ organizationId: '1.5' })).errors)).to.include('organizationId');
            expect(paramsInError((await runValidators({ organizationId: ['1', '2'] })).errors)).to.include('organizationId');
        });
    });

    ['topic', 'interventionLocation'].forEach((field) => {
        describe(field, () => {
            it('normalise une valeur unique en tableau', async () => {
                const { errors, query } = await runValidators({ [field]: 'sur_site' });

                expect(errors).to.deep.equal([]);
                expect((extractReportFilters(query) as Record<string, unknown>)[field]).to.deep.equal(['sur_site']);
            });

            it('conserve un tableau de valeurs', async () => {
                const { errors, query } = await runValidators({ [field]: ['health', 'school'] });

                expect(errors).to.deep.equal([]);
                expect((extractReportFilters(query) as Record<string, unknown>)[field]).to.deep.equal(['health', 'school']);
            });

            it('retire les chaînes vides et n\'ajoute pas la clé quand il ne reste rien', async () => {
                const { errors, query } = await runValidators({ [field]: '' });

                expect(errors).to.deep.equal([]);
                expect(extractReportFilters(query)).to.not.have.property(field);
            });

            it('rejette les caractères hors alphanumérique/underscore', async () => {
                expect(paramsInError((await runValidators({ [field]: 'a-b' })).errors)).to.include(field);
                expect(paramsInError((await runValidators({ [field]: ['ok', '\'; DROP TABLE x; --'] })).errors)).to.include(field);
            });

            it('rejette une valeur de plus de 50 caractères', async () => {
                expect(paramsInError((await runValidators({ [field]: 'a'.repeat(51) })).errors)).to.include(field);
            });

            it('rejette un objet ou un tableau imbriqué', async () => {
                expect(paramsInError((await runValidators({ [field]: { a: 'b' } })).errors)).to.include(field);
                expect(paramsInError((await runValidators({ [field]: [['a']] })).errors)).to.include(field);
            });
        });
    });

    describe('dihalFinancing', () => {
        it('accepte "all" (valeur unique normalisée en tableau)', async () => {
            const { errors, query } = await runValidators({ dihalFinancing: 'all' });

            expect(errors).to.deep.equal([]);
            expect(extractReportFilters(query)).to.deep.equal({ dihalFinancing: ['all'] });
        });

        it('accepte une année à 4 chiffres, seule ou en liste', async () => {
            const single = await runValidators({ dihalFinancing: '2025' });
            const list = await runValidators({ dihalFinancing: ['2024', '2025'] });

            expect(single.errors).to.deep.equal([]);
            expect(extractReportFilters(single.query)).to.deep.equal({ dihalFinancing: ['2025'] });
            expect(list.errors).to.deep.equal([]);
            expect(extractReportFilters(list.query)).to.deep.equal({ dihalFinancing: ['2024', '2025'] });
        });

        it('rejette tout ce qui n\'est ni "all" ni une année à 4 chiffres', async () => {
            const invalid = ['25', '20255', 'abc', 'ALL', 'true', '2025 ', '2O25'];
            const results = await Promise.all(invalid.map(value => runValidators({ dihalFinancing: value })));

            results.forEach(({ errors }, index) => {
                expect(paramsInError(errors), invalid[index]).to.include('dihalFinancing');
            });
        });

        it('rejette une liste contenant une valeur invalide', async () => {
            const { errors } = await runValidators({ dihalFinancing: ['2024', 'abc'] });

            expect(paramsInError(errors)).to.include('dihalFinancing');
        });
    });

    describe('year (paramètre de route)', () => {
        const YEAR_MESSAGE = 'L\'année d\'export doit être une année valide (entre 2000 et 2100)';

        ['2000', '2025', '2100'].forEach((year) => {
            it(`accepte ${year}`, async () => {
                const { errors } = await runValidators({}, { year });

                expect(errors).to.deep.equal([]);
            });
        });

        ['abc', '20255', '1999', '2101', '', '20.5', '2025abc', ' 2025'].forEach((year) => {
            it(`rejette "${year}" avec un message en français`, async () => {
                const { errors } = await runValidators({}, { year });

                expect(paramsInError(errors)).to.include('year');
                expect(messagesInError(errors.filter(error => (error as { path?: string }).path === 'year' || (error as { param?: string }).param === 'year'))).to.include(YEAR_MESSAGE);
            });
        });

        it('rejette une année absente', async () => {
            const { errors } = await runValidators({}, {});

            expect(paramsInError(errors)).to.include('year');
        });
    });

    describe('messages d\'erreur', () => {
        const rejected: Query[] = [
            { status: ['open', 'closed'] },
            { status: 'inconnu' },
            { status: { a: 'b' } },
            { search: ['a', 'b'] },
            { search: 'a'.repeat(201) },
            { search: { a: 'b' } },
            { locationType: 'A-B' },
            { locationTypeUid: 'inconnu' },
            { locationTypeUid: 'region' },
            { locationCode: ['11'] },
            { locationCode: 'a-b' },
            { locationTypeUid: 'organization' },
            { locationOrganizationId: 'abc' },
            { organizationId: 'abc' },
            { topic: 'a-b' },
            { interventionLocation: 'a-b' },
            { dihalFinancing: 'abc' },
            { topic: Array.from({ length: 21 }, () => 'health') },
        ];

        rejected.forEach((query) => {
            it(`ne produit jamais « Invalid value » pour ${JSON.stringify(query).slice(0, 80)}`, async () => {
                const { errors } = await runValidators(query);

                expect(errors.length).to.be.greaterThan(0);
                messagesInError(errors).forEach((message) => {
                    expect(message).to.be.a('string').and.not.equal('Invalid value');
                    expect(message).to.not.match(/^invalid/i);
                });
            });
        });

        it('status envoyé en tableau : message en français sur le champ status', async () => {
            const { errors } = await runValidators({ status: ['open', 'closed'] });

            expect(paramsInError(errors)).to.include('status');
            expect(messagesInError(errors)).to.not.include('Invalid value');
        });

        it('search envoyé en tableau : message en français sur le champ search', async () => {
            const { errors } = await runValidators({ search: ['a', 'b'] });

            expect(paramsInError(errors)).to.include('search');
            expect(messagesInError(errors)).to.not.include('Invalid value');
        });
    });

    describe('taille des listes (topic, interventionLocation, dihalFinancing)', () => {
        const validValue: Record<string, string> = { topic: 'health', interventionLocation: 'eti', dihalFinancing: '2025' };

        ['topic', 'interventionLocation', 'dihalFinancing'].forEach((field) => {
            describe(field, () => {
                const list = (size: number) => Array.from({ length: size }, () => validValue[field]);

                it('accepte 20 éléments', async () => {
                    const { errors, query } = await runValidators({ [field]: list(20) });

                    expect(errors).to.deep.equal([]);
                    expect((extractReportFilters(query) as Record<string, unknown>)[field]).to.have.lengthOf(20);
                });

                it('rejette 21 éléments avec un message en français', async () => {
                    const { errors } = await runValidators({ [field]: list(21) });

                    expect(paramsInError(errors)).to.include(field);
                    messagesInError(errors).forEach((message) => {
                        expect(message).to.not.equal('Invalid value');
                    });
                });

                it('rejette une très longue liste', async () => {
                    const { errors } = await runValidators({ [field]: list(500) });

                    expect(paramsInError(errors)).to.include(field);
                });
            });
        });
    });

    describe('combinaison de filtres', () => {
        it('construit l\'objet ReportFilters complet', async () => {
            const { errors, query } = await runValidators({
                status: 'closed',
                search: 'abri',
                organizationId: '3',
                topic: ['health'],
                interventionLocation: 'eti',
                dihalFinancing: ['all'],
                locationTypeUid: 'region',
                locationCode: '11',
            });

            expect(errors).to.deep.equal([]);
            expect(extractReportFilters(query)).to.deep.equal({
                status: 'closed',
                search: 'abri',
                organizationId: 3,
                topic: ['health'],
                interventionLocation: ['eti'],
                dihalFinancing: ['all'],
                location: { type: 'region', typeUid: 'region', code: '11' },
            });
        });

        it('ignore un paramètre inconnu', async () => {
            const { errors, query } = await runValidators({ foo: 'bar' });

            expect(errors).to.deep.equal([]);
            expect(extractReportFilters(query)).to.deep.equal({});
        });
    });
});
