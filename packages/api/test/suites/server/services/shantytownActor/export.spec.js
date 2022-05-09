const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const { expect } = chai;
chai.use(sinonChai);

const ServiceError = require('#server/errors/ServiceError');
const permissionUtils = require('#server/utils/permission');
const shantytownActorModel = require('#server/models/shantytownActorModel');
const exportService = require('#server/services/shantytownActor/export');

describe.only('services/shantytownActor', () => {
    describe('export()', () => {
        let stubs;
        beforeEach(() => {
            stubs = {
                where: sinon.stub(permissionUtils, 'where'),
                can: sinon.stub(),
                do: sinon.stub(),
            };
            stubs.where.returns({
                can: stubs.can,
            });
            stubs.can.returns({
                do: stubs.do,
            });
        });

        afterEach(() => {
            sinon.restore();
        });

        it('vérifie la permission export.shantytown_actor', async () => {
            const user = {};
            try {
                await exportService(user);
            } catch (error) {
                // ignore
            }

            expect(stubs.can).to.have.been.calledOnceWith(user);
            expect(stubs.do).to.have.been.calledOnceWith('export', 'shantytown_actor');
        });

        it('retourne la liste des intervenants, sérialisés', async () => {
            const rawActors = [{}, {}];

            stubs.do.returns({});
            stubs.findAllByLocation = sinon.stub(shantytownActorModel, 'findAllByLocation');
            stubs.findAllByLocation.resolves(rawActors);

            const response = await exportService();
            expect(response).to.be.an('array');
            expect(response).to.have.lengthOf(rawActors.length);
        });

        it('retourne un tableau vide, si on a pas la permission de lister les intervenants', async () => {
            stubs.do.returns(null);

            const response = await exportService();
            expect(response).to.be.eql([]);
        });

        it('lance une exception ServiceError, en cas d\'échec du modèle', async () => {
            stubs.do.returns({});

            stubs.findAllByLocation = sinon.stub(shantytownActorModel, 'findAllByLocation');
            stubs.findAllByLocation.rejects(new Error('une erreur'));

            let error = null;
            try {
                await exportService();
            } catch (argError) {
                error = argError;
            }

            expect(error).to.be.instanceOf(ServiceError);
            expect(error.message).to.be.eql('une erreur');
            expect(error.code).to.be.eql('fetch_failed');
        });
    });
});
