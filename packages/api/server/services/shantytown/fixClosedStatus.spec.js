const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const { expect } = chai;
chai.use(sinonChai);

const {
    paris,
} = require('#test/utils/location');
const { serialized: fakeShantytown } = require('#test/utils/shantytown');
const shantytownModel = require('#server/models/shantytownModel');
const ServiceError = require('#server/errors/ServiceError');

const fixClosedStatusService = require('./fixClosedStatus');


describe.only('services/shantytown', () => {
    describe('fixClosedStatus()', () => {
        const user = {
            id: global.generate('string'),
            permissions: {
                shantytown: {
                    fix_status: {
                        allowed: true,
                        allow_all: true,
                        allowed_on: [],
                    },
                },
            },
        };
        const data = {
            shantytown: fakeShantytown(paris.city(), { closed_with_solutions: false }),
            closed_with_solutions: 'yes',
        };

        let stubs;

        beforeEach(() => {
            stubs = {
                fixClosedStatus: sinon.stub(shantytownModel, 'fixClosedStatus'),
                findOne: sinon.stub(shantytownModel, 'findOne'),
            };
        });

        afterEach(() => {
            sinon.restore();
        });


        it('met à jour le site en changeant le statut et renvoie le site ainsi modifié', async () => {
            const updatedTown = fakeShantytown(paris.city(), { closed_with_solutions: true });
            stubs.findOne.resolves(updatedTown);

            const response = await fixClosedStatusService(user, data);
            expect(stubs.fixClosedStatus).to.have.been.calledOnceWith(data.shantytown.id, data.closed_with_solutions);
            expect(response).to.be.eql(updatedTown);
        });

        it('Si l\'utilisateur n\'a pas la permission de modifier le status d\'un site fermé, renvoie une exception ServiceError \'permission_denied\'', async () => {
            user.permissions.shantytown.fix_status = {};
            let responseError;
            try {
                await fixClosedStatusService(user, data);
            } catch (error) {
                responseError = error;
            }
            expect(responseError).to.be.instanceOf(ServiceError);
            expect(responseError.code).to.be.eql('permission_denied');
        });
    });
});
