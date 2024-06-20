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
    refuse: sandbox.stub(),
    findOne: sandbox.stub(),
};

const userAccessModel = {
    create: sandbox.stub(),
    update: sandbox.stub(),
};

rewiremock('#db/sequelize').with({ sequelize });
rewiremock('#server/models/userModel/index').with(userModel);
rewiremock('#server/models/userAccessModel/index').with(userAccessModel);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import refuseUserAccess from './refuse';
rewiremock.disable();

describe('userService.refuse()', () => {
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

    it('change le statut du compte à refused en base de données', async () => {
        await refuseUserAccess(42);
        expect(userModel.refuse).to.have.been.calledOnce;
        expect(userModel.refuse).to.have.been.calledWith(42);
    });

    it('retourne le compte refusé', async () => {
        const user = fakeUser({ id: 42, status: 'inactive' });
        userModel.findOne.withArgs(42).resolves(user);

        const response = await refuseUserAccess(42);
        expect(response).to.be.eql(user);
    });

    it('exécute l\'ensemble des requêtes dans une transaction', async () => {
        // userModel.findOne.withArgs(42).resolves(fakeUser({ id: 42, status: 'new' }));
        await refuseUserAccess(42);
        expect(userModel.refuse).to.have.been.calledWith(42, transaction);
        expect(userModel.findOne).to.have.been.calledWith(42, {}, null, 'refuse', transaction);
        expect(transaction.commit).to.have.been.calledOnce;
    });

    it('en cas d\'erreur de la modification de l\'utilisateur, lance une ServiceError', async () => {
        const error = new Error('test');
        userModel.refuse.rejects(error);

        try {
            await refuseUserAccess(42);
        } catch (e) {
            expect(e).to.be.an.instanceof(ServiceError);
            expect(e.code).to.be.equal('refusal_failure');
            expect(e.nativeError).to.be.equal(error);
            return;
        }

        expect.fail('should have thrown an error');
    });

    it('en cas d\'erreur de la modification de l\'utilisateur, rollback la transaction', async () => {
        const error = new Error('refresh_error');
        userModel.refuse.rejects(error);

        try {
            await refuseUserAccess(42);
        } catch (e) {
            expect(transaction.rollback).to.have.been.called;
            return;
        }

        expect.fail('should have thrown an error');
    });

    it('en cas d\'erreur de la recherche de l\'utilisateur, lance une ServiceError', async () => {
        const error = new Error('refresh_failure');
        // userModel.findOne.withArgs(42).resolves();
        userModel.findOne.rejects(error);

        try {
            await refuseUserAccess(42);
        } catch (e) {
            expect(e).to.be.an.instanceof(ServiceError);
            expect(e.code).to.be.equal('refresh_failure');
            expect(e.nativeError).to.be.equal(error);
            return;
        }

        expect.fail('should have thrown an error');
    });

    it('en cas d\'erreur de la recherche de l\'utilisateur, rollback la transaction', async () => {
        const error = new Error('test');
        userModel.findOne.rejects(error);

        try {
            await refuseUserAccess(42);
        } catch (e) {
            expect(transaction.rollback).to.have.been.called;
            return;
        }

        expect.fail('should have thrown an error');
    });

    it('en cas d\'erreur dans la transaction, lance une ServiceError', async () => {
        const error = new Error('test');
        transaction.commit.rejects(error);

        try {
            await refuseUserAccess(42);
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
            await refuseUserAccess(42);
        } catch (e) {
            expect(transaction.rollback).to.have.been.called;
            return;
        }

        expect.fail('should have thrown an error');
    });
});
