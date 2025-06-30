import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import rewiremock from 'rewiremock/node';
import { serialized as fakeUser } from '#test/utils/user';
import ServiceError from '#server/errors/ServiceError';

const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiAsPromised);

// stubs
const sandbox = sinon.createSandbox();
const sequelize = {
    transaction: sandbox.stub(),
};
const userModel = {
    setExpertiseTopics: sandbox.stub(),
    update: sandbox.stub(),
    findOne: sandbox.stub(),
};

rewiremock('#db/sequelize').with({ sequelize });
rewiremock('#server/models/userModel/index').with(userModel);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import setExpertiseTopics from './setExpertiseTopics';
rewiremock.disable();

describe('userService.setExpertiseTopics()', () => {
    afterEach(() => {
        sandbox.reset();
    });

    let transaction;
    beforeEach(() => {
        transaction = {
            commit: sandbox.stub(),
            rollback: sandbox.stub(),
        };
        sequelize.transaction.withArgs().resolves(transaction);
    });

    it('marque en base de données que l\'utilisateur a sélectionné ses sujets de compétence', async () => {
        await setExpertiseTopics(42, [], [], 'test');
        expect(userModel.update).to.have.been.calledOnce;
        expect(userModel.update).to.have.been.calledWith(42, { expertise_topics_chosen: true, expertise_comment: 'test' });
    });

    it('enregistre les topics de l\'utilisateur en base de données', async () => {
        await setExpertiseTopics(42, ['a', 'b'], ['c']);
        expect(userModel.setExpertiseTopics).to.have.been.calledOnce;
        expect(userModel.setExpertiseTopics).to.have.been.calledWith(42, ['a', 'b'], ['c']);
    });

    it('retourne l\'utilisateur mis à jour', async () => {
        const user = fakeUser();
        userModel.findOne.resolves(user);
        const result = await setExpertiseTopics(42, [], []);
        expect(result).to.be.deep.equal(user);
    });

    it('exécute l\'ensemble des requêtes dans une transaction', async () => {
        await setExpertiseTopics(42, [], []);
        expect(userModel.update).to.have.been.calledWith(42, { expertise_topics_chosen: true, expertise_comment: undefined }, transaction);
        expect(userModel.setExpertiseTopics).to.have.been.calledWith(42, [], [], transaction);
        expect(userModel.findOne).to.have.been.calledWith(42, {}, null, 'read', transaction);
        expect(transaction.commit).to.have.been.calledOnce;
    });

    it('en cas d\'erreur de la mise à jour de l\'utilisateur, lance une ServiceError', async () => {
        const error = new Error('test');
        userModel.update.rejects(error);

        try {
            await setExpertiseTopics(42, [], []);
        } catch (e) {
            expect(e).to.be.an.instanceof(ServiceError);
            expect(e.code).to.be.equal('user_update_failure');
            expect(e.nativeError).to.be.equal(error);
            return;
        }

        expect.fail('should have thrown an error');
    });

    it('en cas d\'erreur de la mise à jour de l\'utilisateur, rollback la transaction', async () => {
        const error = new Error('test');
        userModel.update.rejects(error);

        try {
            await setExpertiseTopics(42, [], []);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            expect(transaction.rollback).to.have.been.called;
            return;
        }

        expect.fail('should have thrown an error');
    });

    it('en cas d\'erreur dans l\'enregistrement des topics, lance une ServiceError', async () => {
        const error = new Error('test');
        userModel.setExpertiseTopics.rejects(error);

        try {
            await setExpertiseTopics(42, [], []);
        } catch (e) {
            expect(e).to.be.an.instanceof(ServiceError);
            expect(e.code).to.be.equal('topics_save_failure');
            expect(e.nativeError).to.be.equal(error);
            return;
        }

        expect.fail('should have thrown an error');
    });

    it('en cas d\'erreur dans l\'enregistrement des topics, rollback la transaction', async () => {
        const error = new Error('test');
        userModel.setExpertiseTopics.rejects(error);

        try {
            await setExpertiseTopics(42, [], []);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            expect(transaction.rollback).to.have.been.called;
            return;
        }

        expect.fail('should have thrown an error');
    });

    it('en cas d\'erreur dans la recherche de l\'utilisateur, lance une ServiceError', async () => {
        const error = new Error('test');
        userModel.findOne.rejects(error);

        try {
            await setExpertiseTopics(42, [], []);
        } catch (e) {
            expect(e).to.be.an.instanceof(ServiceError);
            expect(e.code).to.be.equal('user_search_failure');
            expect(e.nativeError).to.be.equal(error);
            return;
        }

        expect.fail('should have thrown an error');
    });

    it('en cas d\'erreur dans la recherche de l\'utilisateur, rollback la transaction', async () => {
        const error = new Error('test');
        userModel.findOne.rejects(error);

        try {
            await setExpertiseTopics(42, [], []);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            expect(transaction.rollback).to.have.been.called;
            return;
        }

        expect.fail('should have thrown an error');
    });

    it('en cas d\'erreur dans la transaction, lance une ServiceError', async () => {
        const error = new Error('test');
        transaction.commit.rejects(error);

        try {
            await setExpertiseTopics(42, [], []);
        } catch (e) {
            expect(e).to.be.an.instanceof(ServiceError);
            expect(e.code).to.be.equal('transaction_failure');
            expect(e.nativeError).to.be.equal(error);
            return;
        }

        expect.fail('should have thrown an error');
    });

    it('en cas d\'erreur dans la transaction, rollback', async () => {
        const error = new Error('test');
        transaction.commit.rejects(error);

        try {
            await setExpertiseTopics(42, [], []);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            expect(transaction.rollback).to.have.been.called;
            return;
        }

        expect.fail('should have thrown an error');
    });
});
