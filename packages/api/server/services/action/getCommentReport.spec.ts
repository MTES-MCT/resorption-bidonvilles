import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import actionModel from '#server/models/actionModel';
import { ActionRowComment } from '#server/models/actionModel/fetchComments/ActionCommentRow.d';

import { row as fakeActionCommentRow } from '#test/utils/actionComment';
import { serialized as fakeUser } from '#test/utils/user';
import permissionUtils from '#server/utils/permission';

import getCommentReport from './getCommentReport';

const { expect } = chai;
chai.use(sinonChai);

describe('services/action.getActionReport()', () => {
    const user = fakeUser();
    const actionCommentRow: ActionRowComment = fakeActionCommentRow();
    let stubs;

    beforeEach(() => {
        stubs = {
            fetchComments: sinon.stub(actionModel, 'fetchComments'),
            can: sinon.stub(permissionUtils, 'can'),
            do: sinon.stub(),
            on: sinon.stub(),
        };
        stubs.can.returns({
            do: stubs.do,
        });
        stubs.do.returns({
            on: stubs.on,
        });
    });

    afterEach(() => {
        sinon.restore();
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
        stubs.fetchComments.resolves([actionCommentRow]);

        const response = await getCommentReport(user);
        expect(response).to.be.eql(
            // eslint-disable-next-line @typescript-eslint/indent, indent
`"S","ID du commentaire","ID de l'action","Publié le","Description","ID de l'auteur(e)","Nom de famille","Structure","Role"
"1",1,1,"01/01/2020","Un commentaire",2,"Dupont","DIHAL","collaborator"`,
        );
    });
});
