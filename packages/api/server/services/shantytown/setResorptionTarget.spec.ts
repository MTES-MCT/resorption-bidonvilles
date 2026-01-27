import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import locationUtils from '#test/utils/location';
import { serialized as fakeShantytown } from '#test/utils/shantytown';
import { serialized as fakeUser } from '#test/utils/user';

import shantytownModel from '#server/models/shantytownModel';
import ServiceError from '#server/errors/ServiceError';
import { AuthUser } from '#server/middlewares/authMiddleware';

import setResorptionTargetService from './setResorptionTarget';

const { expect } = chai;
chai.use(sinonChai);

const { paris } = locationUtils;

describe('services/shantytown', () => {
    describe('setResorptionTarget()', () => {
        let user: AuthUser;
        let data: { shantytown: any };
        let stubs: {
            setResorptionTarget: sinon.SinonStub;
            findOne: sinon.SinonStub;
        };
        let currentYear: number;

        beforeEach(() => {
            currentYear = new Date().getFullYear();
            user = fakeUser();
            user.permissions.shantytown.update = {
                allowed: true,
                allowed_on_national: true,
                allowed_on: null,
            };
            data = {
                shantytown: fakeShantytown(paris.city(), { resorption_target: null }),
            };
            stubs = {
                setResorptionTarget: sinon.stub(shantytownModel, 'setResorptionTarget'),
                findOne: sinon.stub(shantytownModel, 'findOne'),
            };
        });

        afterEach(() => {
            sinon.restore();
        });

        it('met à jour le site en définissant l\'année courante comme objectif de résorption et renvoie le site ainsi modifié', async () => {
            const updatedTown = fakeShantytown(paris.city(), { resorption_target: currentYear });
            stubs.findOne.resolves(updatedTown);
            const response = await setResorptionTargetService(user, data);
            expect(stubs.setResorptionTarget).to.have.been.calledOnceWith(data.shantytown.id, currentYear);
            expect(response).to.be.eql(updatedTown);
        });

        it('renvoie une exception ServiceError \'permission_denied\' si l\'utilisateur n\'a pas la permission de mettre à jour le site', async () => {
            user.permissions.shantytown.update = {
                allowed: false,
                allowed_on_national: false,
                allowed_on: null,
            };
            let responseError: ServiceError;
            try {
                await setResorptionTargetService(user, data);
            } catch (error) {
                responseError = error;
            }
            expect(responseError).to.be.instanceOf(ServiceError);
            expect(responseError.code).to.be.eql('permission_denied');
        });
    });
});
