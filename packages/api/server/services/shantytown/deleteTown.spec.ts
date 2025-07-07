import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import shantytownModel from '#server/models/shantytownModel';
import ServiceError from '#server/errors/ServiceError';
import { serialized as fakeUser } from '#test/utils/user';
import { serialized as fakeTown } from '#test/utils/shantytown';
import deleteTownService from './deleteTown';

const { expect } = chai;
chai.use(sinonChai);

describe('services/shantytown', () => {
    describe('deleteTown()', () => {
        let stubs;
        beforeEach(() => {
            stubs = {
                findOne: sinon.stub(shantytownModel, 'findOne'),
                deleteShantytown: sinon.stub(shantytownModel, 'deleteShantytown'),
            };
        });

        afterEach(() => {
            sinon.restore();
        });

        it('supprime le site', async () => {
            const town = fakeTown();
            stubs.findOne.resolves(town);
            try {
                await deleteTownService(
                    fakeUser({
                        permissions: {
                            shantytown: {
                                delete: { allowed: true, allowed_on_national: true, allowed_on: null },
                            },
                        },
                    }),
                    1,
                );
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
            }

            expect(stubs.deleteShantytown).to.have.been.calledOnceWith(town.id);
        });
        it('renvoie une exception ServiceError \'fetch_failed\' si le modèle échoue', async () => {
            stubs.findOne.rejects(new Error());
            let responseError;
            try {
                await deleteTownService(fakeUser(), 1);
            } catch (error) {
                responseError = error;
            }
            expect(responseError).to.be.instanceOf(ServiceError);
            expect(responseError.code).to.be.eql('fetch_failed');
        });
        it('renvoie une exception ServiceError \'shantytown_unfound\' si le site à supprimer n\'existe pas en bdd', async () => {
            stubs.findOne.resolves(null);
            let responseError;
            try {
                await deleteTownService(fakeUser(), 1);
            } catch (error) {
                responseError = error;
            }
            expect(responseError).to.be.instanceOf(ServiceError);
            expect(responseError.code).to.be.eql('shantytown_unfound');
        });
    });
});
