import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiSubset from 'chai-subset';

import { rewiremock } from '#test/rewiremock';
import { serialized as fakeUser } from '#test/utils/user';
import { updateInput as fakeTown } from '#test/utils/shantytown';
import { AuthUser } from '#server/middlewares/authMiddleware';
import ServiceError from '#server/errors/ServiceError';

const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiSubset);

const sandbox = sinon.createSandbox();
const stubs = {
    sequelize: {
        transaction: sinon.stub(),
    },
    shantytownModel: {
        findRaw: sandbox.stub(),
        findOne: sandbox.stub(),
        update: sandbox.stub(),
    },
    can: sandbox.stub(),
    do: sandbox.stub(),
    on: sandbox.stub(),
};

rewiremock('#server/models/shantytownModel').with(stubs.shantytownModel);
rewiremock('#server/utils/permission').with({ can: stubs.can });
rewiremock('#db/sequelize').with({ sequelize: stubs.sequelize });

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import forceUpdateWithoutChanges from './forceUpdateWithoutChanges';
rewiremock.disable();

describe('services/shantytown', () => {
    describe('forceUpdateWithoutChanges', () => {
        let user: AuthUser;
        let transaction;
        const town = {
            ...fakeTown(),
            location: {
                city: { code: '44162', name: 'Saint-Herblain', main: null },
                epci: { code: '244400404', name: 'Nantes Métropole' },
                departement: { code: '44', name: 'Loire-Atlantique' },
                region: { code: '52', name: 'Pays de la Loire' },
            },
        };
        beforeEach(() => {
            transaction = {
                commit: sinon.stub().resolves(),
                rollback: sinon.stub().resolves(),
            };
            stubs.sequelize.transaction.reset();
            stubs.sequelize.transaction.resolves(transaction);
            stubs.can.returns({
                do: stubs.do,
            });
            stubs.do.returns({
                on: stubs.on,
            });
            user = fakeUser();
            stubs.shantytownModel.findRaw.resolves(town);
        });

        afterEach(() => {
            sandbox.reset();
        });

        it('renvoie un ServiceError si le site n\'existe pas', async () => {
            stubs.shantytownModel.findRaw.resolves(null);

            try {
                await forceUpdateWithoutChanges(1, user);
                throw new Error('Expected forceUpdateWithoutChanges to throw an error');
            } catch (error) {
                expect(error).to.be.instanceOf(ServiceError);
                expect(error.code).to.equal('not_found');
            }
        });

        it('renvoie un ServiceError si l\'utilisateur n\'a pas les permissions', async () => {
            stubs.can.returns({
                do: sinon.stub().returns({
                    on: sinon.stub().returns(false),
                }),
            });

            try {
                await forceUpdateWithoutChanges(1, user);
                throw new Error('Expected forceUpdateWithoutChanges to throw an error');
            } catch (error) {
                expect(error).to.be.instanceOf(ServiceError);
                expect(error.code).to.equal('permission_denied');
            }
        });

        it('renvoie un ServiceError si la mise à jour échoue', async () => {
            stubs.can.returns({
                do: sinon.stub().returns({
                    on: sinon.stub().returns(true),
                }),
            });
            stubs.shantytownModel.update.rejects(new Error('DB error'));

            try {
                await forceUpdateWithoutChanges(1, user);
                throw new Error('Expected forceUpdateWithoutChanges to throw an error');
            } catch (error) {
                expect(error).to.be.instanceOf(ServiceError);
                expect(error.code).to.equal('update_failed');
                expect(error.nativeError).to.be.instanceOf(Error);
                expect(error.nativeError.message).to.equal('DB error');
            }
        });

        it('réussit la mise à jour sans modifications', async () => {
            stubs.can.returns({
                do: sinon.stub().returns({
                    on: sinon.stub().returns(true),
                }),
            });
            stubs.shantytownModel.findOne.resolves(town);

            const result = await forceUpdateWithoutChanges(1, user);

            expect(result).to.be.instanceOf(Object);
            expect(stubs.shantytownModel.findRaw).to.have.been.calledOnceWith(1, transaction);
            expect(stubs.shantytownModel.update).to.have.been.calledOnce;
            expect(stubs.shantytownModel.update.firstCall.args[0]).to.equal(user);
            expect(stubs.shantytownModel.update.firstCall.args[1]).to.equal(1);
            expect(stubs.shantytownModel.update.firstCall.args[3]).to.equal(transaction);
            expect(stubs.shantytownModel.update.firstCall.args[2]).to.containSubset({
                updated_without_any_change: true,
            });
            expect(stubs.shantytownModel.update.firstCall.args[2]).to.not.have.property('location');
            expect(stubs.shantytownModel.update.firstCall.args[2].updated_at).to.be.instanceOf(Date);
            expect(transaction.commit).to.have.been.calledOnce;
            expect(transaction.rollback).not.to.have.been.called;
        });
    });
});
