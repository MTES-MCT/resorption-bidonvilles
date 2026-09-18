import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { rewiremock } from '#test/rewiremock';

const { expect } = chai;
chai.use(sinonChai);

// ─── stubs ────────────────────────────────────────────────────────────────────

const sandbox = sinon.createSandbox();
const queryStub = sandbox.stub();

const fakeSequelize = {
    query: queryStub,
};

rewiremock('#db/sequelize').with({ sequelize: fakeSequelize });
rewiremock('sequelize').with({ QueryTypes: { SELECT: 'SELECT' } });
// enrichWhere ne fait pas d'I/O : on le laisse passer tel quel
rewiremock('../fetch/enrichWhere').callThrough();

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import fetchComments from './fetchComments';
rewiremock.disable();

// ─── tests ────────────────────────────────────────────────────────────────────

describe('models/actionModel/fetchComments/fetchComments()', () => {
    const ACTION_IDS = [1, 2];
    const COMMENT_IDS = [10, 11];

    const createFakeUser = (isAllowedTo: boolean) => ({
        id: 5,
        organization: { id: 8 },
        isAllowedTo: sinon.stub().returns(isAllowedTo),
    });

    beforeEach(() => {
        queryStub.resolves([]);
    });

    afterEach(() => {
        sandbox.reset();
    });

    it(' n\'ajoute aucune clause de visibilité quand user est undefined (appel interne sans notion d\'utilisateur)', async () => {
        await fetchComments(ACTION_IDS, undefined, {}, undefined, undefined);

        const sql: string = queryStub.firstCall.args[0];
        // ':userId = action_comments.created_by' n'apparaît que dans la clause de visibilité :
        // 'action_comments.created_by' seul apparaît aussi, sans rapport, dans le LEFT JOIN vers l'auteur du commentaire.
        expect(sql).to.not.include(':userId = action_comments.created_by');
    });

    it(' ajoute la clause de visibilité par ciblage quand l\'utilisateur n\'a pas la permission listPrivate sur action_comment', async () => {
        const user = createFakeUser(false);

        await fetchComments(ACTION_IDS, undefined, {}, undefined, user as any);

        const sql: string = queryStub.firstCall.args[0];
        expect(sql).to.include(':userId = action_comments.created_by');
    });

    it(' n\'ajoute pas la clause de visibilité quand l\'utilisateur dispose du bypass admin listPrivate (voit tous les commentaires, y compris non ciblés)', async () => {
        const user = createFakeUser(true);

        await fetchComments(ACTION_IDS, undefined, {}, undefined, user as any);

        const sql: string = queryStub.firstCall.args[0];
        expect(sql).to.not.include(':userId = action_comments.created_by');
    });

    it('transmet userId et organizationId dans les replacements quand la clause de visibilité par ciblage est active', async () => {
        const user = createFakeUser(false);

        await fetchComments(ACTION_IDS, undefined, {}, undefined, user as any);

        const options = queryStub.firstCall.args[1];
        expect(options).to.have.nested.property('replacements.userId', user.id);
        expect(options).to.have.nested.property('replacements.organizationId', user.organization.id);
    });

    it(' appelle user.isAllowedTo avec exactement (\'listPrivate\', \'action_comment\') (pas \'shantytown_comment\')', async () => {
        const user = createFakeUser(false);

        await fetchComments(ACTION_IDS, undefined, {}, undefined, user as any);

        expect(user.isAllowedTo).to.have.been.calledOnceWith('listPrivate', 'action_comment');
    });

    it(' injecte une clause WHERE sur actionIds quand ce paramètre est fourni', async () => {
        await fetchComments(ACTION_IDS, undefined, {}, undefined, undefined);

        const sql: string = queryStub.firstCall.args[0];
        expect(sql).to.include('action_comments.fk_action IN (:actionIds)');

        const options = queryStub.firstCall.args[1];
        expect(options).to.have.nested.property('replacements.actionIds').that.deep.equal(ACTION_IDS);
    });

    it(' injecte une clause AND sur commentIds en complément de actionIds quand ce paramètre est fourni', async () => {
        await fetchComments(ACTION_IDS, COMMENT_IDS, {}, undefined, undefined);

        const sql: string = queryStub.firstCall.args[0];
        expect(sql).to.include('action_comments.fk_action IN (:actionIds)');
        expect(sql).to.include('AND action_comments.action_comment_id IN (:commentIds)');

        const options = queryStub.firstCall.args[1];
        expect(options).to.have.nested.property('replacements.commentIds').that.deep.equal(COMMENT_IDS);
    });
});
