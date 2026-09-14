import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import rewiremock from 'rewiremock/node';
import { validationResult } from 'express-validator';

const { expect } = chai;
chai.use(sinonChai);

const sandbox = sinon.createSandbox();
const geoModel = {
    getLocation: sandbox.stub(),
};

rewiremock('#server/models/geoModel').with(geoModel);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import validators from './activity.list.validator';
rewiremock.disable();

async function runValidators(query: Record<string, unknown>) {
    const req: any = { query, body: {} };
    // Express exécute les middlewares de la chaîne de validation dans l'ordre : plusieurs règles
    // portent sur `locationType` et dépendent de l'exécution de la précédente (la valeur par défaut
    // n'est appliquée qu'après la tentative de résolution de la localisation), il faut donc les
    // exécuter séquentiellement, pas en parallèle.
    await validators.reduce(
        (previous, validator) => previous.then(() => validator.run(req)),
        Promise.resolve(),
    );

    return { errors: validationResult(req).array(), body: req.body, query: req.query };
}

describe('controllers/activity/list/activity.list.validator', () => {
    afterEach(() => {
        sandbox.reset();
    });

    describe('locationType / locationCode', () => {
        it('accepte un type et un code valides et peuple req.body.location', async () => {
            const fakeLocation = {
                type: 'departement', region: null, departement: { code: '75', name: 'Paris' }, epci: null, city: null,
            };
            geoModel.getLocation.resolves(fakeLocation);

            const { errors, body } = await runValidators({ locationType: 'departement', locationCode: '75' });

            expect(errors).to.deep.equal([]);
            expect(geoModel.getLocation).to.have.been.calledOnceWith('departement', '75');
            expect(body.location).to.deep.equal(fakeLocation);
        });

        it('sans locationType/locationCode, retombe sur le périmètre national par défaut', async () => {
            const { errors, body } = await runValidators({});

            expect(errors).to.deep.equal([]);
            expect(geoModel.getLocation).to.not.have.been.called;
            expect(body.location).to.deep.equal({
                type: 'nation', region: null, departement: null, epci: null, city: null,
            });
        });

        it('si la localisation demandée n\'existe pas, rejette avec un message dédié', async () => {
            geoModel.getLocation.resolves(null);

            const { errors } = await runValidators({ locationType: 'departement', locationCode: '00' });

            expect(errors.some(e => e.msg === 'Le périmètre géographique demandé n\'existe pas')).to.equal(true);
        });

        // Régression CodeQL "type confusion through parameter tampering" : un paramètre de requête
        // répété (?locationType=a&locationType=b) devient un tableau au lieu d'une chaîne.
        it('rejette locationType envoyé plusieurs fois (tableau) sans planter', async () => {
            const { errors } = await runValidators({ locationType: ['departement', 'region'], locationCode: '75' });

            expect(errors.some(e => e.param === 'locationType'
                && e.msg === 'Le type de périmètre géographique doit être une chaîne de caractères')).to.equal(true);
        });

        it('rejette locationCode envoyé plusieurs fois (tableau) sans planter', async () => {
            const { errors } = await runValidators({ locationType: 'departement', locationCode: ['75', '976'] });

            expect(errors.some(e => e.param === 'locationCode'
                && e.msg === 'Le code de la localisation demandée doit être une chaîne de caractères')).to.equal(true);
        });

        it('rejette locationType sans locationCode', async () => {
            const { errors } = await runValidators({ locationType: 'departement' });

            expect(errors.some(e => e.param === 'locationCode'
                && e.msg === 'Le code de la localisation demandée est obligatoire')).to.equal(true);
        });
    });

    // Régression CodeQL "type confusion through parameter tampering" : le frontend envoie ces trois
    // filtres comme des chaînes jointes par des virgules (ex: "yes,no"), jamais comme des tableaux.
    // Un paramètre répété (?resorbedFilter=yes&resorbedFilter=no) produit un tableau côté Express/qs,
    // qu'il faut rejeter plutôt que de le traiter silencieusement (le code en aval fait .includes()
    // en supposant un tableau).
    describe('activityTypeFilter / resorbedFilter / myTownsFilter', () => {
        it('découpe une chaîne jointe par des virgules en tableau', async () => {
            const { errors, query } = await runValidators({ resorbedFilter: 'yes,no' });

            expect(errors).to.deep.equal([]);
            expect(query.resorbedFilter).to.deep.equal(['yes', 'no']);
        });

        it('applique les valeurs par défaut quand les filtres sont absents', async () => {
            const { errors, query } = await runValidators({});

            expect(errors).to.deep.equal([]);
            expect(query.activityTypeFilter).to.deep.equal([
                'shantytownCreation', 'shantytownClosing', 'shantytownUpdate', 'shantytownComment', 'user', 'actionComment',
            ]);
            expect(query.resorbedFilter).to.deep.equal(['yes', 'no']);
            expect(query.myTownsFilter).to.deep.equal(['yes', 'no']);
        });

        it('rejette resorbedFilter envoyé plusieurs fois (tableau) plutôt que de le traiter silencieusement', async () => {
            const { errors } = await runValidators({ resorbedFilter: ['yes', 'no'] });

            expect(errors.some(e => e.param === 'resorbedFilter'
                && e.msg === 'La liste de filtre "résorbé" doit être une chaîne de caractères')).to.equal(true);
        });

        it('rejette myTownsFilter envoyé plusieurs fois (tableau)', async () => {
            const { errors } = await runValidators({ myTownsFilter: ['yes', 'no'] });

            expect(errors.some(e => e.param === 'myTownsFilter'
                && e.msg === 'La liste de filtre "mes sites" doit être une chaîne de caractères')).to.equal(true);
        });

        it('rejette une valeur inconnue dans resorbedFilter', async () => {
            const { errors } = await runValidators({ resorbedFilter: 'maybe' });

            expect(errors.some(e => e.param === 'resorbedFilter'
                && e.msg === 'Les valeurs "maybe" du filtre "résorbé" n\'existent pas')).to.equal(true);
        });

        it('rejette une valeur inconnue dans activityTypeFilter', async () => {
            const { errors } = await runValidators({ activityTypeFilter: 'notAKnownFilter' });

            expect(errors.some(e => e.param === 'activityTypeFilter'
                && e.msg === 'Les filtres "notAKnownFilter" n\'existent pas')).to.equal(true);
        });
    });
});
