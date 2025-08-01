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
import { RawParcelOwner, ParcelOwners } from '#root/types/resources/ParcelOwner.d';

const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiSubset);

const sandbox = sinon.createSandbox();
const stubs = {
    shantytownParcelOwnerModel: {
        findAll: sandbox.stub(),
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
rewiremock('#server/utils/permission').with({ can: stubs.can });

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import find from './find';
rewiremock.disable();

describe('services/shantytownParcelOwners.create()', () => {
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

    it('vérifie que l\'utilisateur a le droit de lister les propriétaires renseignés', async () => {
        stubs.on.returns(true);
        stubs.shantytownParcelOwnerModel.findAll.resolves(fakeOwners);

        try {
            await find(fakeTestUser, fakeTown);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
        expect(stubs.can).to.have.been.calledOnceWith(fakeTestUser);
        expect(stubs.do).to.have.been.calledOnceWith('access', 'shantytown_owner');
        expect(stubs.on).to.have.been.calledOnceWith(fakeTown);
    });

    it('renvoie un ServiceError si l\'utilisateur n\'a pas le droit de lire les propriétaires de parcelles', async () => {
        stubs.on.returns(false);

        try {
            await find(fakeTestUser, fakeTown);
        } catch (error) {
            expect(error).to.be.instanceOf(ServiceError);
            expect(error.code).to.equal('permission_denied');
            expect(error.message).to.equal('Vous n\'avez pas la permission de lire les propriétaires de parcelles');
        }
    });

    it('retourne un objet avec les ID de propriétaires de parcelles liés au site', async () => {
        stubs.on.returns(true);
        stubs.shantytownParcelOwnerModel.findAll.resolves(fakeOwners);

        let parcelOwners: RawParcelOwner[];
        try {
            parcelOwners = await find(fakeTestUser, fakeTown);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }

        expect(stubs.shantytownParcelOwnerModel.findAll).to.have.been.calledOnceWith(fakeTestUser, fakeTown.id);
        expect(parcelOwners).to.deep.equal(fakeOwners);
    });

    it('renvoie un ServiceError si aucun propriétaire de parcelle n\'est trouvé pour le site', async () => {
        stubs.on.returns(true);
        stubs.shantytownParcelOwnerModel.findAll.resolves(null);

        let returnedError: ServiceError | undefined;
        try {
            await find(fakeTestUser, fakeTown);
        } catch (error) {
            returnedError = error as ServiceError;
        }

        expect(stubs.shantytownParcelOwnerModel.findAll).to.have.been.calledOnceWith(fakeTestUser, fakeTown.id);
        expect(returnedError).to.be.instanceOf(ServiceError);
        expect(returnedError.code).to.equal('parcel_owner_fetch_failed');
        expect(returnedError.message).to.equal('Aucun propriétaire de parcelle trouvé pour ce bidonville');
    });
});
