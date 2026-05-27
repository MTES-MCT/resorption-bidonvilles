import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { rewiremock } from '#test/rewiremock';
import { serialized as fakeUser } from '#test/utils/user';
import { serialized as fakeAction } from '#test/utils/action';
import ServiceError from '#server/errors/ServiceError';

const { expect } = chai;
chai.use(sinonChai);

const sandbox = sinon.createSandbox();
const stubs = {
    actionModelFetch: sandbox.stub(),
    enrichCommentsAttachments: sandbox.stub(),
};

rewiremock('#server/models/actionModel/index').with({
    fetch: stubs.actionModelFetch,
});
rewiremock('./enrichCommentsAttachments').with(stubs.enrichCommentsAttachments);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import fetch from './fetch';
rewiremock.disable();

describe('services/action/fetch()', () => {
    let user;
    let mockActions;

    beforeEach(() => {
        user = fakeUser();
        user.permissions = {
            action: {
                read: {
                    allowed: true,
                    allowed_on_national: true,
                    allowed_on: null,
                },
            },
        };

        mockActions = [
            fakeAction({ id: 1, name: 'Action 1' }),
            fakeAction({ id: 2, name: 'Action 2' }),
        ];

        stubs.enrichCommentsAttachments.callsFake(comment => Promise.resolve({
            ...comment,
            attachments: [],
        }));
    });

    afterEach(() => {
        sandbox.reset();
        sandbox.restore();
    });

    describe('appel sans paramètre actionIds', () => {
        it('retourne toutes les actions accessibles à l\'utilisateur', async () => {
            stubs.actionModelFetch.resolves(mockActions);

            const result = await fetch(user);

            expect(stubs.actionModelFetch).to.have.been.calledOnceWith(user, undefined);
            expect(result).to.have.lengthOf(2);
            expect(result[0]).to.have.property('id', 1);
            expect(result[1]).to.have.property('id', 2);
        });

        it('enrichit les commentaires avec les pièces jointes signées', async () => {
            const actionWithComments = fakeAction({
                id: 1,
                comments: [
                    {
                        id: 1,
                        description: 'Commentaire 1',
                        createdAt: Date.now(),
                        createdBy: {
                            id: 1,
                            first_name: 'Jean',
                            last_name: 'Dupont',
                            organization: 'Structure',
                            organization_id: 1,
                        },
                        attachments: ['file1.pdf', 'file2.jpg'],
                    },
                ],
            });

            stubs.actionModelFetch.resolves([actionWithComments]);

            const result = await fetch(user);

            expect(stubs.enrichCommentsAttachments).to.have.been.called;
            expect(result).to.have.lengthOf(1);
            expect(result[0]).to.have.property('id', 1);
        });
    });

    describe('appel avec paramètre actionIds', () => {
        it('retourne uniquement les actions spécifiées', async () => {
            const specificAction = fakeAction({ id: 42, name: 'Action spécifique' });
            stubs.actionModelFetch.resolves([specificAction]);

            const result = await fetch(user, [42]);

            expect(stubs.actionModelFetch).to.have.been.calledWith(user, [42]);
            expect(result).to.have.lengthOf(1);
            expect(result[0]).to.have.property('id', 42);
        });

        it('retourne un tableau vide si aucune action ne correspond aux IDs fournis', async () => {
            stubs.actionModelFetch.resolves([]);

            const result = await fetch(user, [999]);

            expect(result).to.be.an('array').that.is.empty;
        });
    });

    describe('gestion des erreurs', () => {
        it('lève une ServiceError si actionModel.fetch retourne null', async () => {
            stubs.actionModelFetch.resolves(null);

            let error;
            try {
                await fetch(user);
            } catch (e) {
                error = e;
            }

            expect(error).to.be.instanceOf(ServiceError);
            expect(error.code).to.equal('fetch_failed');
        });

        it('propage les erreurs du modèle', async () => {
            const dbError = new Error('Database connection failed');
            stubs.actionModelFetch.rejects(dbError);

            let error;
            try {
                await fetch(user);
            } catch (e) {
                error = e;
            }

            expect(error).to.equal(dbError);
        });
    });

    describe('régression : vérification du comportement avec undefined vs null', () => {
        it('ne doit PAS passer null comme actionIds au modèle quand le paramètre est omis', async () => {
            stubs.actionModelFetch.resolves(mockActions);

            await fetch(user);

            const callArgs = stubs.actionModelFetch.getCall(0).args;
            expect(callArgs[1]).to.be.undefined;
            expect(callArgs[1]).to.not.equal(null);
        });

        it('retourne bien des résultats quand actionIds est undefined (cas par défaut)', async () => {
            stubs.actionModelFetch.resolves(mockActions);

            const result = await fetch(user);

            expect(result).to.have.lengthOf(2);
            expect(stubs.actionModelFetch).to.have.been.calledWith(user, undefined);
        });
    });
});
