import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiSubset from 'chai-subset';

import { rewiremock } from '#test/rewiremock';
import permissionUtils from '#server/utils/permission';
import moment from 'moment';
import { row as fakeActionCommentRow } from '#test/utils/actionComment';
import { serialized as fakeUser } from '#test/utils/user';
import { AuthUser } from '#server/middlewares/authMiddleware';
import { ActionRowComment } from '#server/models/actionModel/fetchComments/ActionCommentRow.d';

const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiSubset);

const sandbox = sinon.createSandbox();
const stubs = {
    actionModel: {
        fetchComments: sandbox.stub(),
    },
    can: sandbox.stub(permissionUtils, 'can'),
    do: sandbox.stub(),
    on: sandbox.stub(),
    moment: sandbox.stub(moment),
    JSONToCSV: { parse: sandbox.stub() },
};

rewiremock('#server/utils/permission').with({ can: stubs.can });
rewiremock('#server/models/actionModel').with(stubs.actionModel);
rewiremock('json2csv').with(stubs.JSONToCSV);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import getCommentReport from './getCommentReport';
rewiremock.disable();

describe('services/action.getActionReport()', () => {
    const user: AuthUser = fakeUser();
    const actionCommentRow: ActionRowComment = fakeActionCommentRow();

    beforeEach(() => {
        stubs.can.returns({
            do: stubs.do,
        });
        stubs.do.returns({
            on: stubs.on,
        });
    });

    afterEach(() => {
        sandbox.reset();
    });

    it('vérifie que l\'utilisateur a le droit d\'exporter les commentaires des actions au niveau national', async () => {
        try {
            await getCommentReport(user);
        } catch (e) {
            // ignore
        }
        expect(stubs.can).to.have.been.calledOnceWith(user);
        expect(stubs.do).to.have.been.calledOnceWith('export', 'action_comment');
        // eslint-disable-next-line no-unused-expressions
        expect(stubs.on).to.have.been.calledOnceWith({
            type: 'nation', region: null, departement: null, epci: null, city: null,
        });
    });

    it('récupère les commentaires en bdd et les renvoie au formal CSV', async () => {
        stubs.on.returns(true);
        stubs.actionModel.fetchComments.resolves([actionCommentRow]);
        stubs.JSONToCSV.parse.resolves(
            // eslint-disable-next-line @typescript-eslint/indent, indent
`"S","ID du commentaire","ID de l'action","Publié le","Description","ID de l'auteur(e)","Nom de famille","Structure","Role"
"1",1,1,"01/01/2020","Un commentaire",2,"Dupont","DIHAL","collaborator"`,
        );
        const response = await getCommentReport(user);

        expect(response).to.be.eql(
            // eslint-disable-next-line @typescript-eslint/indent, indent
`"S","ID du commentaire","ID de l'action","Publié le","Description","ID de l'auteur(e)","Nom de famille","Structure","Role"
"1",1,1,"01/01/2020","Un commentaire",2,"Dupont","DIHAL","collaborator"`,
        );
    });
});
