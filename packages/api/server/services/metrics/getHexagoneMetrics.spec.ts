import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiSubset from 'chai-subset';

import { rewiremock } from '#test/rewiremock';
import { hexagoneDatas, hexagoneRawDatas, livingConditionsStatuses } from '#test/utils/hexagoneDatas';
import { serialized as fakeUser } from '#test/utils/user';
import { AuthUser } from '#server/middlewares/authMiddleware';
import ServiceError from '#server/errors/ServiceError';
import { DepartementMetricsRawData } from '#root/types/resources/DepartementMetrics.d';
import { HexagoneMetrics } from '#root/types/resources/HexagoneMetrics.d';

const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiSubset);

const fakeTestUser: AuthUser = fakeUser();
const fakeHexagoneRawDatas : DepartementMetricsRawData[] = hexagoneRawDatas();
const fakeHexagoneDatas : HexagoneMetrics = hexagoneDatas();
const fakeLivingConditionsStatuses = livingConditionsStatuses();
const [from, to]: [Date, Date] = [new Date(new Date().setFullYear(new Date().getFullYear() - 2)), new Date()];

const sandbox = sinon.createSandbox();
const stubs = {
    user: {
        ...fakeTestUser,
        isAllowedTo: sandbox.stub(),
    },
    metricsModel: {
        getHexagoneData: sandbox.stub(),
    },
    getLivingConditions: sandbox.stub(),
    getUsenameOf: sandbox.stub(),
    getAddressSimpleOf: sandbox.stub(),

};

rewiremock('#server/models/metricsModel').with(stubs.metricsModel);
rewiremock('#server/models/shantytownModel/_common/livingConditions/v2/statuses/main').with(stubs.getLivingConditions);
rewiremock('#server/models/shantytownModel/_common/getAddressSimpleOf').with(stubs.getAddressSimpleOf);
rewiremock('#server/models/shantytownModel/_common/getUsenameOf').with(stubs.getUsenameOf);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import getHexagoneMetrics from './getHexagoneMetrics';
rewiremock.disable();

describe('services/metrics/getHexagoneMetrics', () => {
    beforeEach(() => {
        sandbox.resetHistory();
        stubs.user.isAllowedTo.returns(true);
        stubs.metricsModel.getHexagoneData.resolves(fakeHexagoneRawDatas);
        stubs.getLivingConditions.returns(fakeLivingConditionsStatuses);
        stubs.getUsenameOf.returns('Site dit Fake site (Fake address, 99999 Fake city)');
        stubs.getAddressSimpleOf.returns("Pas d'adresse précise");
    });

    after(() => {
        sandbox.restore();
    });

    it('vérifie que l\'utilisateur a accès aux données', async () => {
        await getHexagoneMetrics(stubs.user, from, to);

        expect(stubs.user.isAllowedTo('list', 'shantytown')).to.be.equal(true);
    });

    it('renvoie un ServiceError si l\'utilisateur n\'a pas accès aux données', async () => {
        let returnedError: ServiceError | undefined;
        stubs.user.isAllowedTo.returns(false);
        try {
            await getHexagoneMetrics(stubs.user, from, to);
        } catch (error) {
            returnedError = error as ServiceError;
        }

        expect(stubs.user.isAllowedTo).to.have.been.calledOnceWith('list', 'shantytown');
        expect(returnedError).to.be.instanceOf(ServiceError);
        expect(returnedError.code).to.equal('permission_denied');
    });

    it('renvoie les métriques de l\'héxagone', async () => {
        const result = await getHexagoneMetrics(stubs.user, from, to);

        expect(result).to.deep.equal(fakeHexagoneDatas);
    });
});
