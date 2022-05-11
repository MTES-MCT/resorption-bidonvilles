const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const { expect } = chai;
chai.use(sinonChai);

const proxyquire = require('proxyquire');
const shantytownModel = require('#server/models/shantytownModel');
const ServiceError = require('#server/errors/ServiceError');

let fixClosedStatusService;


describe.only('services/shantytown', () => {
    describe('fixClosedStatus()', () => {
        const user = {};
        const data = {
            shantytown: {
                id: 0,
            },
            closed_with_solutions: 'yes',
        };

        let stubs;
        let getPermissionStub;

        beforeEach(() => {
            getPermissionStub = sinon.stub();
            fixClosedStatusService = proxyquire('./fixClosedStatus', { '#server/utils/permission/getPermission': getPermissionStub });
            stubs = {
                fixClosedStatus: sinon.stub(shantytownModel, 'fixClosedStatus'),
                findOne: sinon.stub(shantytownModel, 'findOne'),
            };
        });

        afterEach(() => {
            sinon.restore();
        });
        it('vérifie que l\'utilisateur a le droit de mofidier le statut d\'un site fermé', async () => {
            try {
                await fixClosedStatusService(user, data);
            } catch (error) {
                // ignore
            }
            expect(getPermissionStub).to.have.been.calledOnceWith(user, 'fix_status', 'shantytown');
        });
        it('Si l\'utilisateur n\'a pas la permission, renvoie une exception ServiceError \'permission_denied\'', async () => {
            getPermissionStub.returns(false);
            let responseError;
            try {
                await fixClosedStatusService(user, data);
            } catch (error) {
                responseError = error;
            }
            expect(responseError).to.be.instanceOf(ServiceError);
            expect(responseError.code).to.be.eql('permission_denied');
        });
        it('met à jour le site en changeant le statut et renvoie le site ainsi modifié', async () => {
            getPermissionStub.returns(true);
            const updatedTown = {};
            stubs.findOne.resolves(updatedTown);

            const response = await fixClosedStatusService(user, data);
            expect(stubs.fixClosedStatus).to.have.been.calledOnceWith(data.shantytown.id, data.closed_with_solutions);
            expect(response).to.be.eql({});
        });
    });
});
