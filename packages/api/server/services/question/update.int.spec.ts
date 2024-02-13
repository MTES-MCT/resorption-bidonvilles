import updateQuestion from './update';

const { expect } = require('chai');

describe('services/question/update', () => {
    it.skip('met à jour le contenu d\'une question et la retourne, mise à jour', async () => {
        const response = await updateQuestion(1, {
            question_id: 1,
            updated_by: 1,
            question: 'Je suis une question modifée',
            details: 'Détails modifiés également',
            people_affected: null,
            tags: [],
            other_tag: null,
        }, 1);

        expect(response).to.be.eql({
            question_id: 1,
            updated_by: 1,
            question: 'Je suis une question modifée',
            details: 'Détails modifiés également',
        });
    });
});
