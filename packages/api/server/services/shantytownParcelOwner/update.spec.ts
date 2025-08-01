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
import { ParcelOwnerInsert, ParcelOwners } from '#root/types/resources/ParcelOwner.d';

const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiSubset);

const sandbox = sinon.createSandbox();
const stubs = {
    shantytownModel: {
        findOne: sandbox.stub().resolves(fakeShantytown()),
    },
    shantytownParcelOwnerModel: {
        update: sandbox.stub(),
        findAll: sandbox.stub(),
    },
    serializeOwners: sandbox.stub(),
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

// rewiremock('#server/models/shantytownModel').with(stubs.shantytownModel);
rewiremock('#server/models/shantytownParcelOwnerModel').with(stubs.shantytownParcelOwnerModel);
rewiremock('#db/sequelize').with({ sequelize: stubs.sequelize });
rewiremock('#server/utils/permission').with({ can: stubs.can });
rewiremock('./serializeOwners').with(stubs.serializeOwners);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import update from './update';
rewiremock.disable();

describe('services/shantytownParcelOwners.update()', () => {
    let fakeOwner: ParcelOwnerInsert[];
    let fakeTestUser: AuthUser;
    let fakeTown: Shantytown;

    beforeEach(() => {
        fakeTestUser = fakeUser();
        fakeOwner = [{
            ownerId: 1,
            name: 'Jean Bon',
            type: 3,
            active: true,
        }];
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

    it('vérifie que l\'utilisateur a le droit d\'accéder aux données de propriétaires', async () => {
        stubs.on.returns(true);

        try {
            await update(fakeTestUser, fakeTown, fakeOwner);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
        expect(stubs.can).to.have.been.calledOnceWith(fakeTestUser);
        expect(stubs.do).to.have.been.calledOnceWith('access', 'shantytown_owner');
        expect(stubs.on).to.have.been.calledOnce;
    });

    it('renvoie un ServiceError si l\'utilisateur n\'a pas le droit d\'accéder aux données de propriétaires', async () => {
        let returnedError: ServiceError | undefined;
        stubs.on.returns(false);

        try {
            await update(fakeTestUser, fakeTown, fakeOwner);
        } catch (error) {
            returnedError = error as ServiceError;
        }
        expect(stubs.can).to.have.been.calledOnceWith(fakeTestUser);
        expect(stubs.do).to.have.been.calledOnceWith('access', 'shantytown_owner');
        expect(stubs.on).to.have.been.calledOnce;
        expect(returnedError).to.be.instanceOf(ServiceError);
        expect(returnedError.code).to.equal('permission_denied');
    });

    it('modifie un propriétaire de parcelle', async () => {
        const creationDate = new Date();
        stubs.on.returns(true);
        stubs.shantytownParcelOwnerModel.findAll.resolves([fakeOwner]);
        stubs.shantytownParcelOwnerModel.update.resolves([{
            shantytown_parcel_owner_id: 1,
            fk_shantytown: 100,
            fk_user: 1,
            owner_name: 'Jean Bono',
            fk_owner_type: 2,
            active: true,
            created_at: creationDate.toISOString(),
        }]);
        stubs.serializeOwners.resolves({
            parcelOwnerId: 1,
            shantytownId: 3657,
            owners: [{
                ownerId: 1,
                name: 'Jean Bono',
                type: 1,
                active: true,
                createdAt: creationDate.toISOString(),
                createdBy: {
                    authorId: 1,
                    authorFirstName: fakeTestUser.first_name,
                    authorLastName: fakeTestUser.last_name,
                    organizationName: fakeTestUser.organization.name,
                    organizationId: fakeTestUser.organization.id,
                },
            }],
        } as ParcelOwners);
        fakeOwner[0].name = 'Jean Bono'; // On modifie le nom du propriétaire
        // let parcelOwners: ParcelOwners;

        try {
            await update(fakeTestUser, fakeTown, fakeOwner);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }

        // expect(parcelOwners).to.deep.equal({
        //     parcelOwnerId: 1,
        //     shantytownId: 3657,
        //     owners: [{
        //         ownerId: 1,
        //         name: 'Jean Bono',
        //         type: 1,
        //         active: true,
        //         createdAt: creationDate.toISOString(),
        //         createdBy: {
        //             authorId: 1,
        //             authorFirstName: fakeTestUser.first_name,
        //             authorLastName: fakeTestUser.last_name,
        //             organizationName: fakeTestUser.organization.name,
        //             organizationId: fakeTestUser.organization.id,
        //         },
        //     }],
        // } as ParcelOwners);
        expect(stubs.transaction.commit).to.have.been.calledOnce;
    });

    it('modifie plusieurs propriétaires de parcelles pour le même site', async () => {
        const creationDate = new Date();
        stubs.on.returns(true);
        const fakeOwners: ParcelOwnerInsert[] = [...fakeOwner, { ownerId: 2, name: 'Pierre Quiroul', type: 3 }];
        stubs.shantytownParcelOwnerModel.findAll.resolves([fakeOwner, { ownerId: 2, name: 'Pierre Quiroul', type: 3 }]);
        stubs.shantytownParcelOwnerModel.update.resolves([{
            shantytown_parcel_owner_id: 1,
            fk_shantytown: 1,
            fk_user: 1,
            owner_name: 'Jean Bono',
            fk_owner_type: 2,
            active: true,
            created_at: creationDate.toISOString(),
        }, {
            shantytown_parcel_owner_id: 2,
            fk_shantytown: 1,
            fk_user: 1,
            owner_name: 'Pierre Elelou',
            fk_owner_type: 3,
            active: true,
            created_at: creationDate.toISOString(),
        }]);
        stubs.serializeOwners.resolves({
            parcelOwnerId: 1,
            shantytownId: 1,
            owners: [{
                ownerId: 1,
                name: 'Jean Bono',
                type: 1,
                active: true,
                createdAt: creationDate.toISOString(),
                createdBy: {
                    authorId: 1,
                    authorFirstName: fakeTestUser.first_name,
                    authorLastName: fakeTestUser.last_name,
                    organizationName: fakeTestUser.organization.name,
                    organizationId: fakeTestUser.organization.id,
                },
            }, {
                ownerId: 2,
                name: 'Pierre Elelou',
                type: 3,
                active: true,
                createdAt: creationDate.toISOString(),
                createdBy: {
                    authorId: 1,
                    authorFirstName: fakeTestUser.first_name,
                    authorLastName: fakeTestUser.last_name,
                    organizationName: fakeTestUser.organization.name,
                    organizationId: fakeTestUser.organization.id,
                },
            }],
        } as ParcelOwners);
        fakeOwners[0].name = 'Jean Bono'; // On modifie le nom du propriétaire
        fakeOwners[1].name = 'Pierre Elelou'; // On modifie le nom du propriétaire

        try {
            await update(fakeTestUser, fakeTown, fakeOwners);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }

        // expect(parcelOwnerId).to.deep.equal({
        //     parcelOwnerId: 1,
        //     shantytownId: 1,
        //     owners: [{
        //         ownerId: 1,
        //         name: 'Jean Bono',
        //         type: 1,
        //         active: true,
        //         createdAt: creationDate.toISOString(),
        //         createdBy: {
        //             authorId: 1,
        //             authorFirstName: fakeTestUser.first_name,
        //             authorLastName: fakeTestUser.last_name,
        //             organizationName: fakeTestUser.organization.name,
        //             organizationId: fakeTestUser.organization.id,
        //         },
        //     }, {
        //         ownerId: 2,
        //         name: 'Pierre Elelou',
        //         type: 3,
        //         active: true,
        //         createdAt: creationDate.toISOString(),
        //         createdBy: {
        //             authorId: 1,
        //             authorFirstName: fakeTestUser.first_name,
        //             authorLastName: fakeTestUser.last_name,
        //             organizationName: fakeTestUser.organization.name,
        //             organizationId: fakeTestUser.organization.id,
        //         },
        //     }],
        // } as ParcelOwners);
        expect(stubs.transaction.commit).to.have.been.calledOnce;
    });

    it('modifie la liste de propriétaires de parcelles en en supprimant un', async () => {
        const creationDate = new Date();
        stubs.on.returns(true);
        const fakeOwners: ParcelOwnerInsert[] = [...fakeOwner, { ownerId: 2, name: 'Pierre Quiroul', type: 3 }];
        stubs.shantytownParcelOwnerModel.findAll.resolves([fakeOwner, {
            ownerId: 2, name: 'Pierre Quiroul', type: 3, active: false,
        }]);
        stubs.shantytownParcelOwnerModel.update.resolves([{
            shantytown_parcel_owner_id: 1,
            fk_shantytown: 1,
            fk_user: 1,
            owner_name: 'Jean Bon',
            fk_owner_type: 2,
            active: true,
            created_at: creationDate.toISOString(),
        }, {
            shantytown_parcel_owner_id: 2,
            fk_shantytown: 1,
            fk_user: 1,
            owner_name: 'Pierre Quiroul',
            fk_owner_type: 3,
            active: false,
            created_at: creationDate.toISOString(),
        }]);
        stubs.serializeOwners.resolves({
            parcelOwnerId: 1,
            shantytownId: 1,
            owners: [{
                ownerId: 1,
                name: 'Jean Bon',
                type: 1,
                active: true,
                createdAt: creationDate.toISOString(),
                createdBy: {
                    authorId: 1,
                    authorFirstName: fakeTestUser.first_name,
                    authorLastName: fakeTestUser.last_name,
                    organizationName: fakeTestUser.organization.name,
                    organizationId: fakeTestUser.organization.id,
                },
            }, {
                ownerId: 2,
                name: 'Pierre Quiroul',
                type: 3,
                active: false,
                createdAt: creationDate.toISOString(),
                createdBy: {
                    authorId: 1,
                    authorFirstName: fakeTestUser.first_name,
                    authorLastName: fakeTestUser.last_name,
                    organizationName: fakeTestUser.organization.name,
                    organizationId: fakeTestUser.organization.id,
                },
            }],
        } as ParcelOwners);
        fakeOwners[1].active = false; // On modifie l'état du propriétaire
        // let parcelOwners: ParcelOwners;

        try {
            await update(fakeTestUser, fakeTown, fakeOwners);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }

        // expect(parcelOwners).to.deep.equal({
        //     parcelOwnerId: 1,
        //     shantytownId: 1,
        //     owners: [{
        //         ownerId: 1,
        //         name: 'Jean Bon',
        //         type: 1,
        //         active: true,
        //         createdAt: creationDate.toISOString(),
        //         createdBy: {
        //             authorId: 1,
        //             authorFirstName: fakeTestUser.first_name,
        //             authorLastName: fakeTestUser.last_name,
        //             organizationName: fakeTestUser.organization.name,
        //             organizationId: fakeTestUser.organization.id,
        //         },
        //     }, {
        //         ownerId: 2,
        //         name: 'Pierre Quiroul',
        //         type: 3,
        //         active: false,
        //         createdAt: creationDate.toISOString(),
        //         createdBy: {
        //             authorId: 1,
        //             authorFirstName: fakeTestUser.first_name,
        //             authorLastName: fakeTestUser.last_name,
        //             organizationName: fakeTestUser.organization.name,
        //             organizationId: fakeTestUser.organization.id,
        //         },
        //     }],
        // } as ParcelOwners);
        expect(stubs.transaction.commit).to.have.been.calledOnce;
    });

    it('renvoie un ServiceError si la modification du propriétaire de parcelle échoue', async () => {
        let returnedError: ServiceError | undefined;
        stubs.on.returns(true);
        stubs.shantytownParcelOwnerModel.findAll.resolves([{
            shantytown_parcel_owner_id: 1,
            owner_name: 'Jean Bon',
            fk_owner_type: 3,
            active: true,
            fk_shantytown: fakeTown.id,
            created_at: new Date().toISOString(),
            fk_user: fakeTestUser.id,
        }]);
        stubs.shantytownParcelOwnerModel.update.rejects(new Error('Échec de la modification du propriétaire de parcelle'));

        try {
            await update(fakeTestUser, fakeTown, fakeOwner);
        } catch (error) {
            returnedError = error as ServiceError;
        }
        expect(stubs.shantytownParcelOwnerModel.update).to.have.been.calledOnceWith(fakeTestUser, fakeTown.id, fakeOwner, stubs.transaction);
        expect(stubs.transaction.rollback).to.have.been.calledOnce;
        expect(returnedError).to.be.instanceOf(ServiceError);
        expect(returnedError.code).to.equal('parcel_owner_creation_failed');
    });
});
