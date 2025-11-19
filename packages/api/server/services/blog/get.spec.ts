import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiSubset from 'chai-subset';

import { rewiremock } from '#test/rewiremock';
import ServiceError from '#server/errors/ServiceError';

import { Blog } from '#root/types/resources/Blog.d';

const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiSubset);

const year = new Date().getFullYear();
const fakeBlogPeriod = {
    from_date: `${year}-01-01`,
    to_date: `${year}-01-10`,
};
const fakeBlogReturnObject: Blog = {
    ...fakeBlogPeriod,
    isBadgeActive: false,
};

const sandbox = sinon.createSandbox();
let clock: sinon.SinonFakeTimers;
const stubs = {
    blogModel: { get: sandbox.stub() },
};


rewiremock('#server/models/blogModel/index').with(stubs.blogModel);
rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import get from './get';
rewiremock.disable();

describe('services/blog/get', () => {
    beforeEach(() => {
        clock = sandbox.useFakeTimers(new Date(`${year}-01-05T12:00:00Z`).getTime());
        stubs.blogModel.get.resolves([fakeBlogPeriod]);
    });

    afterEach(() => {
        clock.restore();
        sandbox.restore();
    });

    it('récupère les dates de début et de fin de la période d\'affichage du badge en DB', async () => {
        try {
            await get();
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
        expect(stubs.blogModel.get).to.have.been.calledOnce;
    });

    it('renvoie isBadgeActive à true si la période d\'affichage est en cours', async () => {
        const fakeReturnObject = { ...fakeBlogReturnObject, isBadgeActive: true };
        const blog = await get();
        expect(blog).to.deep.equal(fakeReturnObject);
        expect(blog.isBadgeActive).to.be.true;
    });

    it('renvoie isBadgeActive à false si la période d\'affichage n\'est pas en cours', async () => {
        clock.setSystemTime(new Date(`${year}-10-15T12:00:00Z`).getTime());
        const blog = await get();
        expect(blog).to.deep.equal(fakeBlogReturnObject);
        expect(blog.isBadgeActive).to.be.false;
    });

    it('renvoie un ServiceError si aucune période d\'affichage n\'est trouvée en DB', async () => {
        stubs.blogModel.get.resolves([]);
        try {
            await get();
        } catch (error) {
            expect(error).to.be.instanceOf(ServiceError);
            expect(error).to.have.property('code', 'badge_not_found');
        }
    });

    it('renvoie un ServiceError si la récupération en DB échoue', async () => {
        stubs.blogModel.get.rejects(new Error('DB error'));
        try {
            await get();
        } catch (error) {
            expect(error).to.be.instanceOf(ServiceError);
            expect(error).to.have.property('code', 'badge_fetch_failed');
        }
    });
});
