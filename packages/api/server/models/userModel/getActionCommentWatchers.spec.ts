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

    // Chaque cas vérifie un fragment de la requête SQL générée ; regroupés dans un tableau
    // et exécutés via une seule boucle plutôt que dans un it() répété pour chaque règle
    // (évite la duplication de structure détectée par SonarQube entre les tests).
    const sqlAssertionCases: { title: string, check: (sql: string) => void }[] = [
        {
            title: 'conditionne la permission requise à \'listPrivate\' ou \'list\' selon la confidentialité du commentaire',
            check: (sql) => {
                expect(sql).to.include('CASE WHEN constants.is_private THEN \'listPrivate\' ELSE \'list\' END');
            },
        },
        {
            title: 'filtre les permissions sur l\'entité \'action_comment\' (et non \'shantytown_comment\')',
            check: (sql) => {
                expect(sql).to.include('uap.fk_entity = \'action_comment\'');
                expect(sql).to.not.include('uap.fk_entity = \'shantytown_comment\'');
            },
        },
        {
            title: 'relaxe la contrainte de territoire pour les admins locaux (fk_role = \'local_admin\')',
            check: (sql) => {
                expect(sql).to.include('users.fk_role = \'local_admin\'');
            },
        },
        {
            title: 'relaxe la contrainte de territoire pour les acteurs de l\'action (opérateurs et pilotes)',
            check: (sql) => {
                expect(sql).to.include('action_operators.fk_user');
                expect(sql).to.include('action_managers.fk_user');
                expect(sql).to.include('users.user_id = ANY(constants.actors)');
            },
        },
        {
            title: 'gère le cas national en vérifiant via v_user_areas que le département ou la région de l\'action fait partie des zones d\'intervention de l\'utilisateur',
            check: (sql) => {
                expect(sql).to.include('uap.type = \'nation\'');
                expect(sql).to.include('constants.departement = ANY(v_user_areas.departements)');
                expect(sql).to.include('constants.region = ANY(v_user_areas.regions)');
            },
        },
        {
            title: 'exclut, pour un commentaire privé, les utilisateurs qui ne sont ni ciblés individuellement ni via leur organisation',
            check: (sql) => {
                expect(sql).to.include('constants.is_private IS FALSE');
                expect(sql).to.include('users.user_id = ANY(constants.user_targets)');
                expect(sql).to.include('users.fk_organization = ANY(constants.organization_targets)');
            },
        },
        {
            title: 'exclut les utilisateurs désabonnés de la notification \'action_comment_notification\' (spécifique au domaine action)',
            check: (sql) => {
                expect(sql).to.include('email_subscription = \'action_comment_notification\'');
                expect(sql).to.not.include('email_subscription = \'comment_notification\'');
            },
        },
        {
            title: 'filtre les utilisateurs inactifs en ne conservant que ceux au statut \'active\'',
            check: (sql) => {
                expect(sql).to.include('users.fk_status = \'active\'');
            },
        },
    ];

    sqlAssertionCases.forEach(({ title, check }) => {
        it(title, async () => {
            const { sql } = await callAndGetQueryArgs();
            check(sql);
        });
    });

    it(' transmet le commentId dans les replacements de la requête', async () => {
        const { options } = await callAndGetQueryArgs();
        expect(options).to.have.nested.property('replacements.commentId', COMMENT_ID);
    });
});
