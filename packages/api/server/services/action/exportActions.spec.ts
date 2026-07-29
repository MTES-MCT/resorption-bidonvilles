import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { rewiremock } from '#test/rewiremock';
import { serialized as fakeUser } from '#test/utils/user';

const { expect } = chai;
chai.use(sinonChai);

const sandbox = sinon.createSandbox();

const stubs = {
    getPermission: sandbox.stub(),
    where: sandbox.stub(),
    can: sandbox.stub(),
    fetchReport: sandbox.stub(),
    generateExportFile: sandbox.stub(),
};

rewiremock('#server/utils/permission').with({
    getPermission: stubs.getPermission,
    where: stubs.where,
});
rewiremock('#server/models/actionModel').with({
    fetchReport: stubs.fetchReport,
});
rewiremock('./exportActions.generateExportFile').with(stubs.generateExportFile);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import exportActions from './exportActions';
rewiremock.disable();

describe('services/action/exportActions()', () => {
    let user;
    const year = '2024';

    beforeEach(() => {
        sandbox.reset();
        user = fakeUser();

        stubs.where.returns({
            can: stubs.can,
        });
        stubs.getPermission.returns('allowed');
        stubs.fetchReport.resolves([
            {
                action_id: 1, action_name: 'Action de test', departement_code: '75', finance_dedie: 1000,
            },
        ]);
        stubs.generateExportFile.resolves(Buffer.from('excel file'));
    });

    afterEach(() => {
        sandbox.restore();
    });

    // stubs.can(user).do('read'|'access', ...) doit distinguer les deux appels faits par exportActions :
    // 1er pour les actions ('read', 'action'), 2nd pour les financements ('access', 'action_finances')
    const stubDo = (actionClauseGroup: object, financeClauseGroup: object | null) => {
        const doStub = sandbox.stub();
        doStub.withArgs('read', 'action').returns(actionClauseGroup);
        doStub.withArgs('access', 'action_finances').returns(financeClauseGroup);
        stubs.can = sandbox.stub().returns({ do: doStub });
        stubs.where.returns({ can: stubs.can });
    };

    const getGenerateExportFileArgs = async () => {
        await exportActions(user, year);
        return stubs.generateExportFile.lastCall.args;
    };

    describe('calcul de includeFinances et allowedFinanceActions selon financeClauseGroup', () => {
        it('includeFinances=true et allowedFinanceActions=null quand financeClauseGroup est un objet vide (accès national/territorial complet)', async () => {
            stubDo({}, {});

            const args = await getGenerateExportFileArgs();

            expect(args[2]).to.be.true; // includeFinances
            expect(args[4]).to.be.null; // allowedFinanceActions
        });

        it('includeFinances=true et allowedFinanceActions=null quand financeClauseGroup contient des clés territoriales', async () => {
            stubDo({}, { regions: { query: 'regions.code', value: ['11'] } });

            const args = await getGenerateExportFileArgs();

            expect(args[2]).to.be.true;
            expect(args[4]).to.be.null;
        });

        it('includeFinances=true et allowedFinanceActions=[...] quand financeClauseGroup est restreint à une liste d\'actions', async () => {
            stubDo({}, { actions: { query: 'actions.action_id', value: [251, 410, 523] } });

            const args = await getGenerateExportFileArgs();

            expect(args[2]).to.be.true;
            expect(args[4]).to.deep.equal([251, 410, 523]);
        });

        it('includeFinances=false quand financeClauseGroup est null (aucun accès aux financements)', async () => {
            stubDo({}, null);

            const args = await getGenerateExportFileArgs();

            expect(args[2]).to.be.false;
        });
    });
});
