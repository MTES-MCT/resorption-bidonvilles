import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import rewiremock from 'rewiremock/node';
import chaiSubset from 'chai-subset';

const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiSubset);

const stubs = {
    update: sinon.stub(),
    findOne: sinon.stub(),
    triggerShantytownCloseAlert: sinon.stub(),
    sendMail: sinon.stub(),
};
rewiremock('./_common/sendMailForClosedTown').with(stubs.sendMail);
rewiremock('#server/models/shantytownModel/update').with(stubs.update);
rewiremock('#server/models/shantytownModel/findOne').with(stubs.findOne);
rewiremock('#server/utils/mattermost').with({
    triggerShantytownCloseAlert: stubs.triggerShantytownCloseAlert,
});

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import closeService from './close';
rewiremock.disable();

describe('services/shantytown', () => {
    describe('close()', () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

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

        afterEach(() => {
            Object.values(stubs).forEach((stub: sinon.SinonStub) => stub.reset());
        });

        it('met à jour le site en l\'indiquant comme fermé et renvoie le site ainsi modifié', async () => {
            const updatedTown = {};
            stubs.findOne.resolves(updatedTown);

            const response = await closeService(user, data);
            expect(stubs.update).to.have.been.calledOnce;
            const { args } = stubs.update.getCall(0);
            expect(args[0]).to.be.eql(user);
            expect(args[1]).to.be.eql(data.shantytown.id);
            expect(args[2]).to.containSubset({
                closed_at: '01-01-2019',
                closed_with_solutions: 'no',
                status: 'unknown',
                closing_context: 'contexte',
                closing_solutions: [],
            });
            const updatedAt = args[2].updated_at;
            updatedAt.setHours(0, 0, 0, 0);
            expect(updatedAt).to.be.eql(today);
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
            expect(stubs.sendMail).to.have.been.calledOnce;
        });
    });
});
