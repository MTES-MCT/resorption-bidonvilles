import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiSubset from 'chai-subset';

import { rewiremock } from '#test/rewiremock';
import { serialized as fakeUser } from '#test/utils/user';
import { serialized as fakeShantytown } from '#test/utils/shantytown';
import { serialized as fakeParcelOwners } from '#test/utils/parcelOwners';
import ServiceError from '#server/errors/ServiceError';
import { AuthUser } from '#server/middlewares/authMiddleware';
import { Shantytown } from '#root/types/resources/Shantytown.d';
import { ParcelOwners } from '#root/types/resources/ParcelOwner.d';

const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiSubset);

const sandbox = sinon.createSandbox();
const stubs = {
    shantytownParcelOwnerModel: {
        deleteOwner: sandbox.stub(),
    },
    sequelize: {
        transaction: sandbox.stub(),
    },
    transaction: {
        commit: sandbox.stub(),
        rollback: sandbox.stub(),
    },
    can: sandbox.stub(),
    do: sandbox.stub(),
    on: sandbox.stub(),
};

rewiremock('#server/models/shantytownParcelOwnerModel').with(stubs.shantytownParcelOwnerModel);
rewiremock('#db/sequelize').with({ sequelize: stubs.sequelize });
rewiremock('#server/utils/permission').with({ can: stubs.can });

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import deleteParcelOwner from './delete';
rewiremock.disable();

describe('services/shantytownParcelOwners.delete()', () => {
    let fakeTestUser: AuthUser;
    let fakeTown: Shantytown;
    let fakeOwners: ParcelOwners;

    beforeEach(() => {
        fakeTestUser = fakeUser();
        fakeTown = fakeShantytown();
        fakeOwners = fakeParcelOwners();
        stubs.can.returns({
            do: stubs.do,
        });
        stubs.do.returns({
            on: stubs.on,
        });
        stubs.sequelize.transaction.resolves(stubs.transaction);
    });

    afterEach(() => {
        sandbox.reset();
    });

    it('vérifie que l\'utilisateur a le droit de supprimer les propriétaires renseignés', async () => {
        stubs.on.returns(true);
        stubs.shantytownParcelOwnerModel.deleteOwner.resolves(true);

        try {
            await deleteParcelOwner(fakeTestUser, fakeTown, [1]);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
        expect(stubs.can).to.have.been.calledOnceWith(fakeTestUser);
        expect(stubs.do).to.have.been.calledOnceWith('delete', 'shantytown_owner');
        expect(stubs.on).to.have.been.calledOnceWith(fakeTown);
    });

    it('renvoie un ServiceError si l\'utilisateur n\'a pas le droit de supprimer les propriétaires de parcelles', async () => {
        stubs.on.returns(false);

        try {
            await deleteParcelOwner(fakeTestUser, fakeTown, [1]);
        } catch (error) {
            expect(error).to.be.instanceOf(ServiceError);
            expect(error.code).to.equal('permission_denied');
            expect(error.message).to.equal('Vous n\'avez pas la permission de supprimer les propriétaires de parcelles');
        }
    });

    it('demande la suppression d\'un propriétaire de parcelle', async () => {
        stubs.on.returns(true);
        stubs.shantytownParcelOwnerModel.deleteOwner.resolves(true);
        let result: boolean | undefined;

        try {
            result = await deleteParcelOwner(fakeTestUser, fakeTown, [fakeOwners.owners[0].ownerId]);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
        expect(stubs.shantytownParcelOwnerModel.deleteOwner).to.have.been.calledOnceWith(fakeTown.id, [fakeOwners.owners[0].ownerId]);
        expect(stubs.transaction.commit).to.have.been.calledOnce;
        expect(result).to.be.true;
    });

    it('demande la suppression de plusieurs propriétaires de parcelles', async () => {
        stubs.on.returns(true);
        stubs.shantytownParcelOwnerModel.deleteOwner.resolves(true);
        let result: boolean | undefined;
        const ownerIds = fakeOwners.owners.map(owner => owner.ownerId);

        try {
            result = await deleteParcelOwner(fakeTestUser, fakeTown, ownerIds);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
        expect(stubs.shantytownParcelOwnerModel.deleteOwner).to.have.been.calledOnceWith(fakeTown.id, ownerIds);
        expect(stubs.transaction.commit).to.have.been.calledOnce;
        expect(result).to.be.true;
    });

    it('renvoie un ServiceError si la suppression échoue', async () => {
        stubs.on.returns(true);
        stubs.shantytownParcelOwnerModel.deleteOwner.resolves(false);

        let returnedError: ServiceError | undefined;
        try {
            await deleteParcelOwner(fakeTestUser, fakeTown, [fakeOwners.owners[0].ownerId]);
        } catch (error) {
            returnedError = error as ServiceError;
        }

        expect(stubs.shantytownParcelOwnerModel.deleteOwner).to.have.been.calledOnceWith(fakeTown.id, [fakeOwners.owners[0].ownerId]);
        expect(returnedError).to.be.instanceOf(ServiceError);
        expect(returnedError.code).to.equal('parcel_owner_deletion_failed');
        expect(returnedError.message).to.equal('Échec de la suppression du propriétaire de parcelle');
    });
});
