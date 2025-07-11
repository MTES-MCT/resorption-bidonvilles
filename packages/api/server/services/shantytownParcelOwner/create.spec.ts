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

const sandbox = sinon.createSandbox();
const stubs = {
    shantytownModel: {
        findOne: sandbox.stub().resolves(fakeShantytown()),
    },
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
    can: sandbox.stub(),
    do: sandbox.stub(),
    on: sandbox.stub(),
};

rewiremock('#server/models/shantytownModel').with(stubs.shantytownModel);
rewiremock('#server/models/shantytownParcelOwnerModel').with(stubs.shantytownParcelOwnerModel);
rewiremock('#db/sequelize').with({ sequelize: stubs.sequelize });
rewiremock('#server/utils/permission').with({ can: stubs.can });

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import create from './create';
rewiremock.disable();

describe('services/shantytownParcelOwners.create()', () => {
    let fakeOwner: ParcelOwnerInsert[];
    let fakeTestUser: AuthUser;
    let fakeTown: Shantytown;

    beforeEach(() => {
        fakeOwner = [{
            name: 'Jean Bon',
            type: 1,
        }];
        fakeTestUser = fakeUser();
        fakeTown = fakeShantytown();
        stubs.can.returns({
            do: stubs.do,
        });
        stubs.do.returns({
            on: stubs.on,
        });
        stubs.sequelize.transaction.resolves(stubs.transaction);
        stubs.shantytownModel.findOne.resolves(fakeShantytown());
    });

    afterEach(() => {
        sandbox.reset();
    });

    it('récupère les données du site en question', async () => {
        stubs.on.returns(true);

        try {
            await create(fakeTestUser, fakeTown.id, fakeOwner);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
        expect(stubs.shantytownModel.findOne).to.have.been.calledOnceWith(fakeTestUser, fakeTown.id, null);
    });

    it('renvoie un ServiceError si le site n\'existe pas', async () => {
        let returnedError: ServiceError | undefined;
        stubs.shantytownModel.findOne.rejects(new Error('Le site n\'a pas été trouvé'));

        try {
            await create(fakeTestUser, fakeTown.id, fakeOwner);
        } catch (error) {
            returnedError = error as ServiceError;
        }
        expect(stubs.shantytownModel.findOne).to.have.been.calledOnceWith(fakeTestUser, fakeTown.id, null);
        expect(returnedError).to.be.instanceOf(ServiceError);
        expect(returnedError.code).to.equal('shantytown_unfound');
        expect(returnedError.message).to.equal('Le site n\'a pas été trouvé');
    });

    it('vérifie que l\'utilisateur a le droit d\'ajouter un propriétaire', async () => {
        stubs.on.returns(true);

        try {
            await create(fakeTestUser, fakeTown.id, fakeOwner);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
        expect(stubs.can).to.have.been.calledOnceWith(fakeTestUser);
        expect(stubs.do).to.have.been.calledOnceWith('create', 'shantytown_owner');
        expect(stubs.on).to.have.been.calledOnce;
    });

    it('renvoie un ServiceError si l\'utilisateur n\'a pas le droit d\'ajouter un propriétaire', async () => {
        let returnedError: ServiceError | undefined;
        stubs.on.returns(false);

        try {
            await create(fakeTestUser, fakeTown.id, fakeOwner);
        } catch (error) {
            returnedError = error as ServiceError;
        }
        expect(stubs.can).to.have.been.calledOnceWith(fakeTestUser);
        expect(stubs.do).to.have.been.calledOnceWith('create', 'shantytown_owner');
        expect(stubs.on).to.have.been.calledOnce;
        expect(returnedError).to.be.instanceOf(ServiceError);
        expect(returnedError.code).to.equal('permission_denied');
    });

    it('crée un propriétaire de parcelle', async () => {
        stubs.on.returns(true);
        stubs.shantytownParcelOwnerModel.create.resolves({ parcelOwnerId: 123 });
        let parcelOwnerId: { parcelOwnerId: number };

        try {
            parcelOwnerId = await create(fakeTestUser, fakeTown.id, fakeOwner);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }

        expect(parcelOwnerId).to.deep.equal({ parcelOwnerId: 123 });
        expect(stubs.transaction.commit).to.have.been.calledOnce;
    });

    it('créé plusieurs propriétaires de parcelles pour le même site', async () => {
        stubs.on.returns(true);
        const fakeOwners: ParcelOwnerInsert[] = [...fakeOwner, { name: 'Pierre Quiroul', type: 2 }];
        stubs.shantytownParcelOwnerModel.create.resolves({ parcelOwnerId: 123 });
        fakeTown.id = 2; // Simulate a different town ID for this test
        let parcelOwnerId: { parcelOwnerId: number };

        try {
            parcelOwnerId = await create(fakeTestUser, fakeTown.id, fakeOwners);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }

        expect(parcelOwnerId).to.deep.equal({ parcelOwnerId: 123 });
        expect(stubs.transaction.commit).to.have.been.calledOnce;
    });

    it('renvoie un ServiceError si la création du propriétaire de parcelle échoue', async () => {
        let returnedError: ServiceError | undefined;
        stubs.on.returns(true);
        stubs.shantytownParcelOwnerModel.create.rejects(new Error('Échec de la création du propriétaire de parcelle'));

        try {
            await create(fakeTestUser, fakeTown.id, fakeOwner);
        } catch (error) {
            returnedError = error as ServiceError;
        }
        expect(stubs.shantytownParcelOwnerModel.create).to.have.been.calledOnceWith(fakeTestUser, fakeTown.id, fakeOwner, stubs.transaction);
        expect(stubs.transaction.rollback).to.have.been.calledOnce;
        expect(returnedError).to.be.instanceOf(ServiceError);
        expect(returnedError.code).to.equal('parcel_owner_creation_failed');
    });
});
