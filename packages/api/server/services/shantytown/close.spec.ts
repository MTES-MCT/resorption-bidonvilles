import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

const { expect } = chai;
chai.use(sinonChai);

import proxyquire from 'proxyquire';
import shantytownModelFactory from '#server/models/shantytownModel';
import mattermostUtils from '#server/utils/mattermost';

const shantytownModel = shantytownModelFactory();
let closeService;


describe.only('services/shantytown', () => {
    describe('close()', () => {
        const user = {};
        const data = {
            shantytown: {
                id: 0,
            },
            closed_at: '01-01-2019',
            closed_with_solutions: 'no',
            closing_context: 'contexte',
            status: 'unknown',
            solutions: [],

        };

        let stubs;
        let sendMailStub;

        beforeEach(() => {
            sendMailStub = sinon.stub();
            closeService = proxyquire('./close', { './_common/sendMailForClosedTown': sendMailStub });
            stubs = {
                update: sinon.stub(shantytownModel, 'update'),
                findOne: sinon.stub(shantytownModel, 'findOne'),
                triggerShantytownCloseAlert: sinon.stub(mattermostUtils, 'triggerShantytownCloseAlert'),
            };
        });

        afterEach(() => {
            sinon.restore();
        });

        it('met à jour le site en l\'indiquant comme fermé et renvoie le site ainsi modifié', async () => {
            const updatedTown = {};
            stubs.findOne.resolves(updatedTown);

            const response = await closeService(user, data);
            expect(stubs.update).to.have.been.calledOnceWith(user, data.shantytown.id, {
                closed_at: '01-01-2019',
                closed_with_solutions: 'no',
                status: 'unknown',
                closing_context: 'contexte',
                closing_solutions: [],
            });
            expect(response).to.be.eql({});
        });
        it('envoie une notification mattermost', async () => {
            await closeService(user, data);
            // eslint-disable-next-line no-unused-expressions
            expect(stubs.triggerShantytownCloseAlert).to.have.been.calledOnce;
        });
        it('envoie une notification mail aux utilisateurs du departement', async () => {
            await closeService(user, data);
            // eslint-disable-next-line no-unused-expressions
            expect(sendMailStub).to.have.been.calledOnce;
        });
    });
});
