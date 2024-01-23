import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { rewiremock } from '#test/rewiremock';
import fakeKeys from '#test/utils/attachmentKeys';
import ServiceError from '#server/errors/ServiceError';

const { expect } = chai;
chai.use(sinonChai);

// mock all dependencies
const sandbox = sinon.createSandbox();
const archiveAttachmentModel = sandbox.stub();
rewiremock('#server/models/attachmentModel/archiveAttachment').with(archiveAttachmentModel);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import archiveAttachment from './archiveAttachment';
rewiremock.disable();

describe('services/attachment/archiveAttachment', () => {
    afterEach(() => {
        sandbox.reset();
    });

    it('supprime l\'attachment de la base de données', async () => {
        await archiveAttachment(fakeKeys({ attachment_id: 1 }));
        expect(archiveAttachmentModel).to.have.been.calledOnceWithExactly(1);
    });

    it('lance une exception si le modèle échoue', async () => {
        const error = new Error('fake error');
        archiveAttachmentModel.rejects(error);

        try {
            await archiveAttachment(fakeKeys());
        } catch (e) {
            expect(e).to.be.an.instanceOf(ServiceError);
            expect(e.code).to.equal('delete_failed');
            expect(e.nativeError).to.be.an.instanceOf(Error);
            return;
        }

        expect.fail('L\'exception n\'a pas été lancée');
    });
});
