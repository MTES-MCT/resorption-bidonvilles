import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { rewiremock } from '#test/rewiremock';
import ServiceError from '#server/errors/ServiceError';
import { AuthUser } from '#server/middlewares/authMiddleware';
import { serialized as fakeUser } from '#test/utils/user';

const { expect } = chai;
chai.use(sinonChai);

const sandbox = sinon.createSandbox();

const stubs = {
    getDepartementsSummaryData: sandbox.stub(),
    can: sandbox.stub(),
    do: sandbox.stub(),
    on: sandbox.stub(),
    getLivingConditionsStatuses: sandbox.stub(),
};

rewiremock('#server/models/metricsModel').with({
    getDepartementsSummaryData: stubs.getDepartementsSummaryData,
});

rewiremock('#server/utils/permission').with({
    can: stubs.can,
});

rewiremock('#server/models/shantytownModel/_common/livingConditions/v2/statuses/main').with(
    stubs.getLivingConditionsStatuses,
);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import getDepartementsSummaryMetrics from './getDepartementsSummaryMetrics';
rewiremock.disable();

describe('services/metrics', () => {
    describe('getDepartementsSummaryMetrics()', () => {
        const user: AuthUser = fakeUser();
        const departementCodes = ['04', '13'];

        beforeEach(() => {
            stubs.can.returns({
                do: stubs.do,
            });
            stubs.do.withArgs('access', 'shantytown_justice').returns({
                on: stubs.on,
            });

            stubs.on.callsFake((location: any) => location?.departement?.code === '13');

            stubs.getLivingConditionsStatuses.callsFake(() => ({
                water: { status: 'good' },
                electricity: { status: 'good' },
                trash: { status: 'bad' },
                fire_prevention: { status: 'good' },
                sanitary: { status: 'good' },
                pest_animals: { status: 'good' },
            }));
        });

        afterEach(() => {
            sandbox.reset();
        });

        it('agrège correctement les indicateurs et applique le filtrage justice par département', async () => {
            stubs.getDepartementsSummaryData.resolves([
                {
                    departement_code: '13',
                    population_total: 10,
                    population_couples: 4,
                    population_minors: 2,
                    minors_in_school: 1,
                    owner_complaint: true,
                    justice_procedure: true,
                    police_status: 'granted',
                    origins: ['european'],
                    out_of_date: true,
                    heatwave_status: true,
                },
                {
                    departement_code: '04',
                    population_total: 0,
                    population_couples: null,
                    population_minors: null,
                    minors_in_school: null,
                    owner_complaint: true,
                    justice_procedure: true,
                    police_status: 'granted',
                    origins: [],
                    out_of_date: false,
                    heatwave_status: false,
                },
            ]);

            const metrics = await getDepartementsSummaryMetrics(user, departementCodes);

            expect(stubs.getDepartementsSummaryData).to.have.been.calledOnceWith(user, departementCodes);

            expect(metrics).to.have.property('summary');
            expect(metrics.summary.number_of_towns).to.deep.equal({
                all: 2,
                eu_only: 1,
                unknown_population: 1,
                out_of_date: 1,
            });

            expect(metrics.summary.number_of_persons).to.deep.equal({
                all: 10,
                eu_only: 10,
            });

            expect(metrics.summary.number_of_households).to.equal(4);
            expect(metrics.summary.number_of_minors).to.equal(2);
            expect(metrics.summary.number_of_schooled_minors).to.equal(1);

            expect(metrics.summary.number_of_towns_with_water).to.equal(2);
            expect(metrics.summary.number_of_towns_with_electricity).to.equal(2);
            expect(metrics.summary.number_of_towns_with_trash_evacuation).to.equal(0);
            expect(metrics.summary.number_of_towns_with_fire_prevention).to.equal(2);
            expect(metrics.summary.number_of_towns_with_toilets).to.equal(2);
            expect(metrics.summary.number_of_towns_without_pest_animals).to.equal(2);

            expect(metrics.summary.number_of_towns_with_heatwave).to.equal(1);

            // justice: seul le département 13 est autorisé
            expect(metrics.summary.number_of_towns_with_owner_complaint).to.equal(1);
            expect(metrics.summary.number_of_towns_with_justice_procedure).to.equal(1);
            expect(metrics.summary.number_of_towns_with_police).to.equal(1);
        });

        it("renvoie une exception ServiceError 'fetch_failed' si le modèle échoue", async () => {
            stubs.getDepartementsSummaryData.rejects(new Error('db error'));

            let responseError: any;
            try {
                await getDepartementsSummaryMetrics(user, departementCodes);
            } catch (error) {
                responseError = error;
            }

            expect(responseError).to.be.instanceOf(ServiceError);
            expect(responseError.code).to.be.eql('fetch_failed');
        });
    });
});
