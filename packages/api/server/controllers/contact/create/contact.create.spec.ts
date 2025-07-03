import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import rewiremock from 'rewiremock/node';
import { mockReq, mockRes } from 'sinon-express-mock';
import { serialized as fakeUser } from '#test/utils/user';

const { expect } = chai;
chai.use(sinonChai);

const sandbox = sinon.createSandbox();
const userService = {
    register: sandbox.stub(),
};
const contactService = {
    notifyNewsletterRegistration: sandbox.stub(),
    notifyContact: sandbox.stub(),
    registerReferral: sandbox.stub(),
};

rewiremock('#server/services/user/index').with(userService);
rewiremock('#server/services/contact').with(contactService);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import contactController from './contact.create';
rewiremock.disable();

describe.skip('contactController.create()', () => {
    afterEach(() => {
        sandbox.restore();
    });

    // demande de contact
    it('envoie la notification d\'une demande de contact', async () => {
        const body = {
            request_type: ['help'],
        };
        const req = mockReq({ body });
        const res = mockRes();

        await contactController(req, res, () => {});
        expect(contactService.notifyContact).to.have.been.calledOnce;
        expect(contactService.notifyContact).to.have.been.calledWith({
            ...body,
            is_new_organization: false,
        });
    });
    it('répond avec un code 200 et un body vide', async () => {
        const body = {
            request_type: ['help'],
        };
        const req = mockReq({ body });
        const res = mockRes();

        await contactController(req, res, () => {});
        expect(res.status).to.have.been.calledOnceWith(200);
        expect(res.send).to.have.been.calledOnceWith(null);
    });
    it('en cas d\'erreur de traitement d\'une demande de contact, répond avec un code 500 et un détail de l\'erreur', async () => {
        const body = {
            request_type: ['help'],
        };
        const req = mockReq({ body });
        const res = mockRes();
        const next = sandbox.stub();

        const error = new Error();
        contactService.notifyContact.rejects(error);

        await contactController(req, res, next);
        expect(res.status).to.have.been.calledWith(500);
        expect(res.send).to.have.been.calledWith({
            user_message: 'Une erreur inconnue est survenue',
        });
        expect(next).to.have.been.calledOnceWith(error);
    });

    // demande d'accès
    it('si la demande n\'est pas une demande d\'accès, n\'enregistre pas de nouvel utilisateur en base', async () => {
        const body = {
            request_type: ['help'],
        };
        const req = mockReq({ body });
        const res = mockRes();

        await contactController(req, res, () => {});
        expect(userService.register).to.not.have.been.called;
    });
    it('si la demande est une demande d\'accès, n\'envoie pas de notification de contact', async () => {
        const body = {
            request_type: ['access-request'],
            is_actor: true,
            organization_category: 'public_establishment',
        };
        const req = mockReq({ body });
        const res = mockRes();

        await contactController(req, res, () => {});
        expect(contactService.notifyContact).to.not.have.been.called;
    });
    it('si la demande est une demande d\'accès, enregistre l\'utilisateur en base', async () => {
        const body = {
            request_type: ['access-request'],
            is_actor: true,
            organization_category: 'public_establishment',
        };
        const req = mockReq({ body });
        const res = mockRes();

        await contactController(req, res, () => {});
        expect(userService.register).to.have.been.calledOnceWith(body);
    });
    it('si la demande est une demande d\'accès, répond avec un code 201', async () => {
        const body = {
            request_type: ['access-request'],
            is_actor: true,
            organization_category: 'public_establishment',
        };
        const req = mockReq({ body });
        const res = mockRes();

        await contactController(req, res, () => {});
        expect(res.status).to.have.been.calledWith(201);
    });
    it('si la demande est une demande d\'accès, répond avec l\'utilisateur créé', async () => {
        const body = {
            request_type: ['access-request'],
            is_actor: true,
            organization_category: 'public_establishment',
        };
        const req = mockReq({ body });
        const res = mockRes();

        const newUser = fakeUser();
        userService.register.resolves(newUser);

        await contactController(req, res, () => {});
        expect(res.send).to.have.been.calledOnceWith(newUser);
    });

    // enregistrement newsletter
    it('si le contact n\'inclue pas d\'enregistrement à la newsletter, n\'envoie pas la notification spécifique', async () => {
        const body = {
            request_type: ['help'],
        };
        const req = mockReq({ body });
        const res = mockRes();

        await contactController(req, res, () => {});
        expect(contactService.notifyNewsletterRegistration).to.not.have.been.called;
    });
    it('si le contact inclue un enregistrement à la newsletter, envoie une notification spécifique', async () => {
        const body = {
            request_type: ['register-newsletter'],
        };
        const req = mockReq({ body });
        const res = mockRes();

        await contactController(req, res, () => {});
        expect(contactService.notifyNewsletterRegistration).to.have.been.calledOnceWith(body);
    });
    it('ignore les erreurs de notification de newsletter', async () => {
        const body = {
            request_type: ['register-newsletter'],
        };
        const req = mockReq({ body });
        const res = mockRes();

        contactService.notifyNewsletterRegistration.rejects();

        await contactController(req, res, () => {});
        expect(res.status).to.have.been.calledWith(200);
    });

    // referral
    it('si le contact n\'inclue pas un referral, ne tente pas d\'enregistrement referral en base', async () => {
        const body = {
            request_type: ['help'],
            referral: null,
        };
        const req = mockReq({ body });
        const res = mockRes();

        await contactController(req, res, () => {});
        expect(contactService.registerReferral).to.not.have.been.called;
    });
    it('si le contact inclue un referral, enregistre le referral en base', async () => {
        const body = {
            request_type: ['help'],
            referral: 'other',
            referral_other: 'a colleague',
        };
        const req = mockReq({ body });
        const res = mockRes();

        await contactController(req, res, () => {});
        expect(contactService.registerReferral).to.have.been.calledOnceWith({
            ...body,
            user_id: undefined,
        });
    });
    it('si le contact inclue un referral, enregistre le referral en base avec l\'id de l\'utilisateur créé', async () => {
        const body = {
            request_type: ['access-request'],
            is_actor: true,
            organization_category: 'public_establishment',
            referral: 'other',
            referral_other: 'a colleague',
        };
        const req = mockReq({ body });
        const res = mockRes();

        userService.register.resolves({ id: 123 });

        await contactController(req, res, () => {});
        expect(contactService.registerReferral).to.have.been.calledOnceWith({
            ...body,
            user_id: 123,
        });
    });
    it('ignore les erreurs d\'enregistrement de referral', async () => {
        const body = {
            request_type: ['help'],
            referral: 'dihal_event',
        };
        const req = mockReq({ body });
        const res = mockRes();

        contactService.registerReferral.rejects();

        await contactController(req, res, () => {});
        expect(res.status).to.have.been.calledWith(200);
    });
});
