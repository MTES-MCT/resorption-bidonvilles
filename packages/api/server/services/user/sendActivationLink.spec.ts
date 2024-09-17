import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { rewiremock } from '#test/rewiremock';
import { serialized as fakeUser } from '#test/utils/user';
import ServiceError from '#server/errors/ServiceError';

const { expect } = chai;
chai.use(sinonChai);

const sandbox = sinon.createSandbox();
const sequelize = {
    transaction: sandbox.stub(),
};
const setPermissionOptions = sandbox.stub();
const findSingleUser = sandbox.stub();
const createUserAccess = sandbox.stub();
const accessRequestService = {
    resetRequestsForUser: sandbox.stub(),
    handleAccessRequestApproved: sandbox.stub(),
};
const authUtils = {
    getExpiracyDateForActivationTokenCreatedAt: sandbox.stub(),
};

rewiremock('#db/config/sequelize').with(sequelize);
rewiremock('#server/models/userModel/setPermissionOptions').with(setPermissionOptions);
rewiremock('#server/models/userModel/findOne').with(findSingleUser);
rewiremock('#server/models/userAccessModel/create').with(createUserAccess);
rewiremock('#server/services/accessRequest/accessRequestService').with(accessRequestService);
rewiremock('#server/utils/auth').with(authUtils);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import sendActivationLink from './sendActivationLink';
rewiremock.disable();

describe('userService/sendActivationLink', () => {
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

    it('crée une transaction si aucune transaction n\'est passée en paramètre', async () => {
        authUtils.getExpiracyDateForActivationTokenCreatedAt.returns(new Date());
        await sendActivationLink(fakeUser({ id: 42 }), fakeUser({ id: 1 }), [], {} as any);
        expect(sequelize.transaction).to.not.have.been.called;
    });

    it('met à jour les options de l\'utilisateur', async () => {
        const activator = fakeUser({ id: 42 });
        const user = fakeUser({ id: 1 });
        authUtils.getExpiracyDateForActivationTokenCreatedAt.returns(new Date());

        await sendActivationLink(activator, user, ['option1', 'option2']);
        expect(setPermissionOptions).to.have.been.calledOnceWith(user.id, ['option1', 'option2'], transaction);
    });

    it('crée un nouvel accès pour l\'utilisateur', async () => {
        const clock = sinon.useFakeTimers(new Date().getTime());

        const activator = fakeUser({ id: 42 });
        const user = fakeUser({ id: 1 });
        const now = new Date();
        const expiresAt = new Date();
        authUtils.getExpiracyDateForActivationTokenCreatedAt.returns(expiresAt);

        await sendActivationLink(activator, user);
        expect(createUserAccess).to.have.been.calledOnceWith({
            fk_user: 1,
            sent_by: 42,
            created_at: now,
            expires_at: expiresAt,
        });
        clock.restore();
    });

    it('met en place les mails de relances automatiques pour l\'utilisateur', async () => {
        const activator = fakeUser({ id: 42 });
        const user = fakeUser({ id: 1 });

        createUserAccess.resolves(1989);
        authUtils.getExpiracyDateForActivationTokenCreatedAt.returns(new Date(2024, 1, 1));

        await sendActivationLink(activator, user);
        expect(accessRequestService.resetRequestsForUser).to.have.been.calledOnceWith(user);
        expect(accessRequestService.handleAccessRequestApproved).to.have.been.calledOnceWith(user, {
            id: 1989,
            expires_at: 1706742000,
            sent_by: activator,
        });
    });

    it('retourne l\'utilisateur mis à jour', async () => {
        const refreshedUser = fakeUser({ id: 1, status: 'active' });

        authUtils.getExpiracyDateForActivationTokenCreatedAt.returns(new Date());
        findSingleUser.resolves(refreshedUser);
        const response = await sendActivationLink(fakeUser({ id: 42 }), fakeUser({ id: 1 }));

        expect(response).to.be.eql(refreshedUser);
    });

    it('exécute l\'ensemble des requêtes dans une transaction', async () => {
        authUtils.getExpiracyDateForActivationTokenCreatedAt.returns(new Date());

        await sendActivationLink(fakeUser({ id: 42 }), fakeUser({ id: 1 }));

        expect(setPermissionOptions.getCall(0).args[2]).to.be.eql(transaction);
        expect(createUserAccess.getCall(0).args[1]).to.be.eql(transaction);
        expect(findSingleUser.getCall(0).args[4]).to.be.eql(transaction);
        expect(transaction.commit).to.have.been.calledOnce;
    });

    it('ne commit pas la transaction s\'il s\'agit d\'une transaction passée en paramètre', async () => {
        authUtils.getExpiracyDateForActivationTokenCreatedAt.returns(new Date());
        await sendActivationLink(fakeUser({ id: 42 }), fakeUser({ id: 1 }), [], transaction);

        expect(transaction.commit).to.not.have.been.called;
    });

    it('en cas d\'erreur, rollback la transaction', async () => {
        const error = new Error('test');
        setPermissionOptions.rejects(error);

        try {
            await sendActivationLink(fakeUser({ id: 42 }), fakeUser({ id: 1 }));
        } catch (e) {
            expect(transaction.rollback).to.have.been.called;
            return;
        }

        expect.fail('should have thrown an error');
    });

    it('en cas d\'erreur, ne rollback pas la transaction s\'il s\'agit d\'une transaction passée en paramètre', async () => {
        const error = new Error('test');
        setPermissionOptions.rejects(error);

        try {
            await sendActivationLink(fakeUser({ id: 42 }), fakeUser({ id: 1 }), [], transaction);
        } catch (e) {
            expect(transaction.rollback).to.not.have.been.called;
            return;
        }

        expect.fail('should have thrown an error');
    });

    it('en cas d\'erreur, lance une ServiceError', async () => {
        const error = new Error('test');
        setPermissionOptions.rejects(error);

        try {
            await sendActivationLink(fakeUser({ id: 42 }), fakeUser({ id: 1 }));
        } catch (e) {
            expect(e).to.be.an.instanceof(ServiceError);
            expect(e.code).to.be.equal('generic_failure');
            expect(e.nativeError).to.be.equal(error);
            return;
        }

        expect.fail('should have thrown an error');
    });
});
