import ServiceError from '#server/errors/ServiceError';

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import rewiremock from 'rewiremock/node';

const { expect } = chai;
chai.use(sinonChai);

const sandbox = sinon.createSandbox();
const sequelize = {
    transaction: sandbox.stub(),
};
const userModel = {
    isTracked: sandbox.stub(),
    update: sandbox.stub(),
};

const userNavigationLogsModel = {
    insertWebapp: sandbox.stub(),
};

rewiremock('#db/sequelize').with({ sequelize });
rewiremock('#server/models/userModel/index').with(userModel);
rewiremock('#server/models/userNavigationLogsModel/index').with(userNavigationLogsModel);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import insertNavigationLog from '#server/services/userNavigationLogs/insert';

rewiremock.disable();

describe('services/userNavigationLogs/insert()', () => {
    let transaction;
    beforeEach(() => {
        transaction = {
            commit: sandbox.stub(),
            rollback: sandbox.stub(),
        };
        sequelize.transaction.withArgs().resolves(transaction);
    });

    afterEach(() => {
        sandbox.reset();
    });

    it('insert un log de navigation en base de données', async () => {
        userModel.isTracked.resolves(true);
        userNavigationLogsModel.insertWebapp.resolves(1);
        await insertNavigationLog(1, 'page');
    });

    it('demande l\'insertion du log de navigation avec les paramètres attendus', async () => {
        await insertNavigationLog(1, 'page');
        expect(userNavigationLogsModel.insertWebapp).to.have.been.calledOnceWith(1, 'page', transaction);
    });

    it('enregistre la date et l\'heure de cet accès dans la table users', async () => {
        userModel.isTracked.resolves(true);
        await insertNavigationLog(1, 'page');
    });

    it('retourne l\'identifiant du log nouvellement inséré', async () => {
        userModel.isTracked.resolves(true);
        userNavigationLogsModel.insertWebapp.resolves(2);
        const logId = await insertNavigationLog(1, 'page');
        expect(logId).to.be.equal(2);
    });

    it('génère une exception adaptée en cas d\'erreur pour vérifier si l\'utilisateur est tracké ', async () => {
        userModel.isTracked.rejects(new Error('fetch failed'));
        try {
            await insertNavigationLog(1, 'page');
        } catch (error) {
            expect(error).to.be.instanceOf(ServiceError);
            expect(error.code).to.be.equal('fetch_failed');
            expect(error.message).to.be.equal('fetch failed');
            return;
        }

        expect.fail('Should have thrown an error !');
    });

    it('n\'insère pas de log si l\'utilisateur n\'est pas tracké', async () => {
        userModel.isTracked.resolves(false);
        await insertNavigationLog(1, 'page');
        expect(userNavigationLogsModel.insertWebapp).not.to.have.been.called;
    });

    it('génère une exception adaptée en cas d\'erreur d\'insertion en base de données', async () => {
        userModel.isTracked.resolves(true);
        userNavigationLogsModel.insertWebapp.rejects(new Error('insertion failed'));

        try {
            await insertNavigationLog(1, 'page');
        } catch (error) {
            expect(error).to.be.instanceOf(ServiceError);
            expect(error.code).to.be.equal('insert_failed');
            return;
        }

        expect.fail();
    });

    it('génère une exception adaptée en cas d\'erreur de mise à jour en base de données', async () => {
        userModel.isTracked.resolves(true);
        userModel.update.rejects(new Error('update_user_failed'));

        try {
            await insertNavigationLog(1, 'page');
        } catch (error) {
            expect(error).to.be.instanceOf(ServiceError);
            expect(error.code).to.be.equal('update_user_failed');
            return;
        }

        expect.fail();
    });

    it('commit la transaction une fois toutes les requêtes effectuées', async () => {
        userModel.isTracked.resolves(true);
        userNavigationLogsModel.insertWebapp.resolves(2);
        await insertNavigationLog(1, 'page');
        expect(transaction.commit).to.have.been.calledOnce;
    });

    it('ne committe pas la transaction si une requête échoue', async () => {
        userModel.isTracked.resolves(true);
        userModel.update.rejects(new Error('update_user_failed'));
        try {
            await insertNavigationLog(1, 'page');
        } catch (error) {
            expect(error).to.be.instanceOf(ServiceError);
            expect(transaction.commit).not.to.have.been.calledOnce;
        }
    });

    it('rollback la transaction si une requête échoue', async () => {
        userModel.isTracked.resolves(true);
        userModel.update.rejects(new Error('update_user_failed'));
        try {
            await insertNavigationLog(1, 'page');
        } catch (error) {
            expect(error).to.be.instanceOf(ServiceError);
            expect(transaction.rollback).to.have.been.calledOnce;
        }
    });
});
