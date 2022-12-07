import create from '#server/services/note/create';
import noteModel from '#server/models/noteModel';
import ServiceError from '#server/errors/ServiceError';

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

const { expect } = chai;
chai.use(sinonChai);

function getRandomString(length = 6): string {
    return Math.random()
        .toString(20)
        .substring(2, length);
}

const note = {
    note_id: getRandomString(30),
    created_from: 'onglet_note',
    number_of_copies: 0,
    created_by: 1,
    created_at: (new Date()).toString()
}

describe.only('services/note', () => {
    describe('create()', () => {
        let stub;
        beforeEach(() => {
            stub = sinon.stub(noteModel, 'create');
        });
        afterEach(() => {
            stub.restore();
        });

        it('demande l\'insertion de la note en base de données', async () => {
            await create(note.note_id, note.created_from, note.number_of_copies, note.created_by, note.created_at);
            expect(stub).to.have.been.calledOnceWithExactly(note.note_id, note.created_from, note.number_of_copies, note.created_by, note.created_at);
        });

        it('retourne l\'identifiant de la note nouvellement insérée', async () => {
            stub.resolves(note.note_id);
            const noteId = await create(note.note_id, note.created_from, note.number_of_copies, note.created_by, note.created_at);
            expect(noteId).to.be.equal(note.note_id);
        });

        it('génère une exception adaptée en cas d\'erreur d\'insertion en base de données', async () => {
            stub.rejects(new Error('insertion failed'));

            try {
                await create(note.note_id, note.created_from, note.number_of_copies, note.created_by, note.created_at);
            } catch (error) {
                expect(error).to.be.instanceOf(ServiceError);
                expect(error.code).to.be.equal('insert_failed');
                expect(error.message).to.be.equal('insertion failed');
                return;
            }

            expect.fail();
        });
    });
});

