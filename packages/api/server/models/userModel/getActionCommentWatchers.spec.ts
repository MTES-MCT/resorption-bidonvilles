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

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import getActionCommentWatchers from './getActionCommentWatchers';
rewiremock.disable();

// ─── tests ────────────────────────────────────────────────────────────────────

describe('models/userModel/getActionCommentWatchers()', () => {
    const COMMENT_ID = 42;
    const fakeRows = [
        { email: 'watcher@example.com', first_name: 'Jean', last_name: 'Dupont' },
    ];

    beforeEach(() => {
        queryStub.resolves(fakeRows);
    });

    afterEach(() => {
        sandbox.reset();
    });

    // Exécute la fonction testée une fois et expose la requête SQL générée et ses options
    // d'appel, pour éviter de répéter ce triplet dans chaque test ci-dessous.
    const callAndGetQueryArgs = async () => {
        const result = await getActionCommentWatchers(COMMENT_ID);
        return {
            result,
            sql: queryStub.firstCall.args[0] as string,
            options: queryStub.firstCall.args[1],
        };
    };

    it(' retourne tel quel le tableau de lignes renvoyé par sequelize.query (passe-plat)', async () => {
        const { result } = await callAndGetQueryArgs();

        expect(queryStub).to.have.been.calledOnce;
        expect(result).to.deep.equal(fakeRows);
    });

    // Chaque cas se ramène à une liste de fragments que la requête SQL générée doit
    // (ou ne doit pas) contenir : une pure table de données, sans fonction répétée,
    // parcourue par un seul it() (évite toute duplication de structure entre les tests).
    const sqlAssertionCases: { title: string, includes: string[], excludes?: string[] }[] = [
        {
            title: 'conditionne la permission requise à \'listPrivate\' ou \'list\' selon la confidentialité du commentaire',
            includes: ['CASE WHEN constants.is_private THEN \'listPrivate\' ELSE \'list\' END'],
        },
        {
            title: 'filtre les permissions sur l\'entité \'action_comment\' (et non \'shantytown_comment\')',
            includes: ['uap.fk_entity = \'action_comment\''],
            excludes: ['uap.fk_entity = \'shantytown_comment\''],
        },
        {
            title: 'relaxe la contrainte de territoire pour les admins locaux (fk_role = \'local_admin\')',
            includes: ['users.fk_role = \'local_admin\''],
        },
        {
            title: 'relaxe la contrainte de territoire pour les acteurs de l\'action (opérateurs et pilotes)',
            includes: [
                'action_operators.fk_user',
                'action_managers.fk_user',
                'users.user_id = ANY(constants.actors)',
            ],
        },
        {
            title: 'gère le cas national en vérifiant via v_user_areas que le département ou la région de l\'action fait partie des zones d\'intervention de l\'utilisateur',
            includes: [
                'uap.type = \'nation\'',
                'constants.departement = ANY(v_user_areas.departements)',
                'constants.region = ANY(v_user_areas.regions)',
            ],
        },
        {
            title: 'exclut, pour un commentaire privé, les utilisateurs qui ne sont ni ciblés individuellement ni via leur organisation',
            includes: [
                'constants.is_private IS FALSE',
                'users.user_id = ANY(constants.user_targets)',
                'users.fk_organization = ANY(constants.organization_targets)',
            ],
        },
        {
            title: 'exclut les utilisateurs désabonnés de la notification \'action_comment_notification\' (spécifique au domaine action)',
            includes: ['email_subscription = \'action_comment_notification\''],
            excludes: ['email_subscription = \'comment_notification\''],
        },
        {
            title: 'filtre les utilisateurs inactifs en ne conservant que ceux au statut \'active\'',
            includes: ['users.fk_status = \'active\''],
        },
    ];

    sqlAssertionCases.forEach(({ title, includes, excludes = [] }) => {
        it(title, async () => {
            const { sql } = await callAndGetQueryArgs();

            includes.forEach(fragment => expect(sql).to.include(fragment));
            excludes.forEach(fragment => expect(sql).to.not.include(fragment));
        });
    });

    it(' transmet le commentId dans les replacements de la requête', async () => {
        const { options } = await callAndGetQueryArgs();
        expect(options).to.have.nested.property('replacements.commentId', COMMENT_ID);
    });
});
