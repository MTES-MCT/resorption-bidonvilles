import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { rewiremock } from '#test/rewiremock';
import ServiceError from '#server/errors/ServiceError';
import { serialized as fakeUser } from '#test/utils/user';
import locations from '#test/utils/location';
import { serialized as fakeShantytown } from '#test/utils/shantytown';

const { expect } = chai;
chai.use(sinonChai);

const sandbox = sinon.createSandbox();
const stubs = {
    getAllowedLocations: sandbox.stub(),
    fetchData: sandbox.stub(),
    generateExportFile: sandbox.stub(),
    saveStats: sandbox.stub(),
};

rewiremock('./exportTowns.getAllowedLocations').with(stubs.getAllowedLocations);
rewiremock('./exportTowns.fetchData').with(stubs.fetchData);
rewiremock('./exportTowns.generateExportFile').with(stubs.generateExportFile);
rewiremock('./exportTowns.saveStats').with(stubs.saveStats);

rewiremock.enable();
// eslint-disable-next-line import/first, import/newline-after-import
import exportTowns from './exportTowns';
rewiremock.disable();

describe('services/shantytown.exportTowns()', () => {
    const user = fakeUser({ id: 42 });
    const region = locations.paris.region();

    beforeEach(() => {
        stubs.getAllowedLocations.returns([region]);
        stubs.fetchData.resolves([fakeShantytown()]);
        stubs.generateExportFile.resolves(Buffer.from('fake buffer'));
        stubs.saveStats.resolves();
    });

    afterEach(() => {
        sandbox.reset();
    });

    it('identifie correctement un export de données actuelles', async () => {
        const date = new Date();
        await exportTowns(user, region, [], false, date);

        expect(stubs.getAllowedLocations).to.be.calledOnce;
        expect(stubs.getAllowedLocations).to.be.calledWith(user, region, false);
    });

    it('identifie correctement un export de données passées', async () => {
        const date = new Date(2023, 0, 1);
        await exportTowns(user, region, [], false, date);

        expect(stubs.getAllowedLocations).to.be.calledOnce;
        expect(stubs.getAllowedLocations).to.be.calledWith(user, region, true);
    });

    it('collecte bien les données uniquement sur les territoires autorisés', async () => {
        const allowedLocations = [locations.paris.epci(), locations.paris.city()];
        stubs.getAllowedLocations.returns(allowedLocations);

        await exportTowns(user, region);
        expect(stubs.fetchData).to.be.calledOnce;
        expect(stubs.fetchData).to.be.calledWith(user, allowedLocations);
    });

    it('collecte bien les données des sites ouverts uniquement', async () => {
        await exportTowns(user, region);
        expect(stubs.fetchData).to.be.calledOnce;
        expect(stubs.fetchData).to.be.calledWith(user, [region], false);
    });

    it('collecte bien les données des sites fermés quand cela est demandé', async () => {
        await exportTowns(user, region, [], true);
        expect(stubs.fetchData).to.be.calledOnce;
        expect(stubs.fetchData).to.be.calledWith(user, [region], true);
    });

    it('génère bien le fichier excel avec les données collectées', async () => {
        const shantytowns = [fakeShantytown(undefined, { shantytown_id: 1 }), fakeShantytown(undefined, { shantytown_id: 2 })];
        stubs.fetchData.resolves(shantytowns);

        await exportTowns(user, region);

        expect(stubs.generateExportFile).to.be.calledOnce;
        expect(stubs.generateExportFile).to.be.calledWith(user, shantytowns);
    });

    it('retourne bien le buffer du fichier excel', async () => {
        const buffer = Buffer.from('fake buffer');
        stubs.generateExportFile.resolves(buffer);

        const response = await exportTowns(user, region);
        expect(response).to.be.eql(buffer);
    });

    it('lance un service error, si l\'utilisateur n\'a pas les accès nécessaires', async () => {
        stubs.getAllowedLocations.returns([]);

        let responseError;
        try {
            await exportTowns(user, region);
        } catch (error) {
            responseError = error;
        }

        expect(responseError).to.be.instanceOf(ServiceError);
        expect(responseError.code).to.be.eql('permission_denied');
        expect(responseError.nativeError.message).to.be.eql('Vous n\'êtes pas autorisé(e) à exporter les données sur le périmètre géographique demandé');
    });

    it('lance un service error, si la collecte des données échoue', async () => {
        stubs.fetchData.rejects(new Error('une erreur'));

        let responseError;
        try {
            await exportTowns(user, region);
        } catch (error) {
            responseError = error;
        }

        expect(responseError).to.be.instanceOf(ServiceError);
        expect(responseError.code).to.be.eql('fetch_failed');
        expect(responseError.nativeError).to.be.eql(new Error('une erreur'));
    });

    it('lance un service error, s\'il n\'y a aucune donnée sur le(s) territoire(s) ciblé(s)', async () => {
        stubs.fetchData.resolves([]);

        let responseError;
        try {
            await exportTowns(user, region);
        } catch (error) {
            responseError = error;
        }

        expect(responseError).to.be.instanceOf(ServiceError);
        expect(responseError.code).to.be.eql('fetch_failed');
        expect(responseError.nativeError.message).to.be.eql('Il n\'y a aucun site à exporter pour le périmètre géographique demandé');
    });
});
