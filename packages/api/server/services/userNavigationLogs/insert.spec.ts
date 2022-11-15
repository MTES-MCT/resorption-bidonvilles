import insert from '#server/services/userNavigationLogs/insert';
import userNavigationLogsModel from '#server/models/userNavigationLogsModel';
import ServiceError from '#server/errors/ServiceError';

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

const { expect } = chai;
chai.use(sinonChai);

describe('services/userNavigationLogs/insert()', () => {
    let stub;
    beforeEach(() => {
        stub = sinon.stub(userNavigationLogsModel, 'insert');
    });
    afterEach(() => {
        stub.restore();
    });

    it('demande l\'insertion du log en base de données', async () => {
        await insert(1, 'page', 'webapp');
        expect(stub).to.have.been.calledOnceWithExactly(1, 'page', 'webapp');
    });

    it('retourne l\'identifiant du log nouvellement inséré', async () => {
        stub.resolves(2);
        const logId = await insert(1, 'page', 'webapp');
        expect(logId).to.be.equal(2);
    });

    it('génère une exception adaptée en cas d\'erreur d\'insertion en base de données', async () => {
        stub.rejects(new Error('insertion failed'));

        try {
            await insert(1, 'page', 'webapp');
        } catch (error) {
            expect(error).to.be.instanceOf(ServiceError);
            expect(error.code).to.be.equal('insert_failed');
            expect(error.message).to.be.equal('insertion failed');
            return;
        }

        expect.fail();
    });
});
