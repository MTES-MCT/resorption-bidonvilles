import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { serialized as generateUser } from '#test/utils/user';

import { sequelize } from '#db/sequelize';
import shantytownModel from '#server/models/shantytownModel';

const { update } = shantytownModel;

const { expect } = chai;
chai.use(sinonChai);

describe.only('shantytownModel.update()', () => {
    const dependencies = {
        query: undefined,
    };
    beforeEach(() => {
        dependencies.query = sinon.stub(sequelize, 'query');
    });
    afterEach(() => {
        Object.values(dependencies).forEach(stub => stub && stub.restore());
    });

    describe('Si l\'utilisateur n\'a pas la permission de modifier les données judiciaires', () => {
        it('la requête SQL ne touche pas ces colonnes', async () => {
            const editor = generateUser({
                permissions: {
                    shantytown: {
                        update: { allowed: true },
                    },
                    shantytown_justice: {
                        access: { allowed: false },
                    },
                },
            });

            dependencies.query.onCall(0).resolves([[1]]);

            await update(editor, 1, {
                owner_complaint: true,
                justice_procedure: true,
                justice_rendered: true,
                justice_rendered_at: new Date(),
                justice_rendered_by: 'TGI',
                justice_challenged: true,
                police_status: 'granted',
                police_requested_at: new Date(),
                police_granted_at: new Date(),
                bailiff: 'Huissier',
            }, {});

            const args = dependencies.query.getCalls()[3].args[0];
            [
                'owner_complaint', 'justice_procedure', 'justice_rendered', 'justice_rendered_at',
                'justice_rendered_by', 'justice_challenged', 'police_status', 'police_requested_at',
                'police_granted_at', 'bailiff',
            ].forEach(key => expect(args).to.not.have.string(key));
            expect(dependencies.query).to.have.been.called;
        });
    });
});
