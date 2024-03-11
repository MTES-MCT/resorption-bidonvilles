import insert from '#server/services/userNavigationLogs/insert';
import userNavigationLogsModel from '#server/models/userNavigationLogsModel';
import userModel from '#server/models/userModel';
import ServiceError from '#server/errors/ServiceError';

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

const { expect } = chai;
chai.use(sinonChai);

describe('services/userNavigationLogs/insert()', () => {
    let stubs;

    beforeEach(() => {
        stubs = {
            insertWebapp: sinon.stub(userNavigationLogsModel, 'insertWebapp'),
            isTracked: sinon.stub(userModel, 'isTracked'),
            update: sinon.stub(userModel, 'update'),
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it('demande l\'insertion du log en base de données', async () => {
        stubs.isTracked.resolves(true);
        await insert(1, 'page');
    });

    it('demande l\'insertion du log avec l\'origine', async () => {
        stubs.isTracked.resolves(true);
        await insert(1, 'page');
        expect(stubs.insertWebapp).to.have.been.calledOnceWith(1, 'page');
    });

    it('enregistre la date et l\'heure de cet accès dans la table users', async () => {
        stubs.isTracked.resolves(true);
        await insert(1, 'page');
    });

    it('retourne l\'identifiant du log nouvellement inséré', async () => {
        stubs.isTracked.resolves(true);
        stubs.insertWebapp.resolves(2);
        const logId = await insert(1, 'page');
        expect(logId).to.be.equal(2);
    });

    it('génère une exception adaptée en cas d\'erreur pour vérifier si l\'utilisateur est tracké ', async () => {
        stubs.isTracked.rejects(new Error('fetch failed'));
        try {
            await insert(1, 'page');
        } catch (error) {
            expect(error).to.be.instanceOf(ServiceError);
            expect(error.code).to.be.equal('fetch_failed');
            expect(error.message).to.be.equal('fetch failed');
            return;
        }

        expect.fail();
    });

    it('n\'insère pas de log si l\'utilisateur n\'est pas tracké', async () => {
        stubs.isTracked.resolves(false);
        await insert(1, 'page');
        expect(stubs.insertWebapp).not.to.have.been.called;
    });

    it('génère une exception adaptée en cas d\'erreur d\'insertion en base de données', async () => {
        stubs.isTracked.resolves(true);
        stubs.insertWebapp.rejects(new Error('insertion failed'));

        try {
            await insert(1, 'page');
        } catch (error) {
            expect(error).to.be.instanceOf(ServiceError);
            expect(error.code).to.be.equal('insert_failed');
            expect(error.message).to.be.equal('insertion failed');
            return;
        }

        expect.fail();
    });
});
