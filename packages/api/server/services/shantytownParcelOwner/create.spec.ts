import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiSubset from 'chai-subset';

import { rewiremock } from '#test/rewiremock';
import { serialized as fakeUser } from '#test/utils/user';
import { serialized as fakeShantytown } from '#test/utils/shantytown';
import ServiceError from '#server/errors/ServiceError';
import { AuthUser } from '#server/middlewares/authMiddleware';
import { Shantytown } from '#root/types/resources/Shantytown.d';
import { ParcelOwnerInsert } from '#root/types/resources/ParcelOwner.d';

const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiSubset);

const fakeTestUser: AuthUser = fakeUser();

const sandbox = sinon.createSandbox();
const stubs = {
    shantytownParcelOwnerModel: {
        create: sandbox.stub(),
    },
    sequelize: {
        transaction: sandbox.stub(),
    },
    transaction: {
        commit: sandbox.stub(),
        rollback: sandbox.stub(),
    },
    user: {
        ...fakeTestUser,
        isAllowedTo: sandbox.stub(),
    },
};

rewiremock('#server/models/shantytownParcelOwnerModel').with(stubs.shantytownParcelOwnerModel);
rewiremock('#db/sequelize').with({ sequelize: stubs.sequelize });

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import create from './create';
rewiremock.disable();

describe('services/shantytownParcelOwners.create()', () => {
    let fakeOwner: ParcelOwnerInsert[];
    // let fakeTestUser: AuthUser;
    let fakeTown: Shantytown;

    beforeEach(() => {
        fakeOwner = [{
            ownerId: 1,
            name: 'Jean Bon',
            type: 1,
        }];
        // fakeTestUser = fakeUser();
        fakeTown = fakeShantytown();
        // stubs.user = { ...stubs.user, ...fakeTestUser };
        stubs.user.isAllowedTo.returns(true);
        stubs.sequelize.transaction.resolves(stubs.transaction);
    });

    afterEach(() => {
        sandbox.reset();
    });

    it('vérifie que l\'utilisateur a le droit d\'ajouter un propriétaire', async () => {
        try {
            await create(stubs.user, fakeTown.id, fakeOwner);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }

        expect(stubs.user.isAllowedTo).to.have.been.calledWith('access', 'shantytown_owner');
        expect(stubs.user.isAllowedTo.firstCall.returnValue).to.equal(true);
    });

    it('renvoie un ServiceError si l\'utilisateur n\'a pas le droit d\'ajouter un propriétaire', async () => {
        let returnedError: ServiceError | undefined;
        stubs.user.isAllowedTo.returns(false);

        try {
            await create(stubs.user, fakeTown.id, fakeOwner);
        } catch (error) {
            returnedError = error as ServiceError;
        }

        expect(stubs.user.isAllowedTo).to.have.been.calledOnceWith('access', 'shantytown_owner');
        expect(returnedError).to.be.instanceOf(ServiceError);
        expect(returnedError.code).to.equal('permission_denied');
    });

    it('crée un propriétaire de parcelle', async () => {
        stubs.shantytownParcelOwnerModel.create.resolves({ parcelOwnerId: 123 });
        let parcelOwnerId: { parcelOwnerId: number };

        try {
            parcelOwnerId = await create(stubs.user, fakeTown.id, fakeOwner);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }

        expect(parcelOwnerId).to.deep.equal({ parcelOwnerId: 123 });
        expect(stubs.transaction.commit).to.have.been.calledOnce;
    });

    it('créé plusieurs propriétaires de parcelles pour le même site', async () => {
        const fakeOwners: ParcelOwnerInsert[] = [...fakeOwner, { ownerId: 2, name: 'Pierre Quiroul', type: 2 }];
        stubs.shantytownParcelOwnerModel.create.resolves({ parcelOwnerId: 123 });
        fakeTown.id = 2; // Simulate a different town ID for this test
        let parcelOwnerId: { parcelOwnerId: number };

        try {
            parcelOwnerId = await create(stubs.user, fakeTown.id, fakeOwners);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }

        expect(parcelOwnerId).to.deep.equal({ parcelOwnerId: 123 });
        expect(stubs.transaction.commit).to.have.been.calledOnce;
    });

    it('renvoie un ServiceError si la création du propriétaire de parcelle échoue', async () => {
        let returnedError: ServiceError | undefined;
        stubs.shantytownParcelOwnerModel.create.rejects(new Error('Échec de la création du propriétaire de parcelle'));

        try {
            await create(stubs.user, fakeTown.id, fakeOwner);
        } catch (error) {
            returnedError = error as ServiceError;
        }
        expect(stubs.shantytownParcelOwnerModel.create).to.have.been.calledOnceWith(stubs.user, fakeTown.id, fakeOwner, stubs.transaction);
        expect(stubs.transaction.rollback).to.have.been.calledOnce;
        expect(returnedError).to.be.instanceOf(ServiceError);
        expect(returnedError.code).to.equal('parcel_owner_creation_failed');
    });
});
