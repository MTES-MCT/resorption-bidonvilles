/* **************************************************************************************************
 * TOOLS
 * *********************************************************************************************** */

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from "sinon-chai";
import rewiremock from 'rewiremock/node';

import { expect } from 'chai';
import { mockRes } from 'sinon-express-mock';

import userModel from '#server/models/userModel';
import userService from '#server/services/userService';

import mailService from '#server/services/mailService';
import accessRequestService from '#server/services/accessRequest/accessRequestService';

chai.use(sinonChai);

function generateFakeUser() {
    return {
        id: global.generate('number'),
        email: global.generate('string'),
        departement: global.generate('string'),
        map_center: [global.generate('number'), global.generate('number')],
        first_name: global.generate('string'),
        last_name: global.generate('string'),
        company: global.generate('string'),
        permissions: {
            feature: [
                global.generate('string'),
                global.generate('string'),
            ],
            data: [
                global.generate('string'),
                global.generate('string'),
            ],
        },
    };
}


/* **************************************************************************************************
 * FIXTURES
 * *********************************************************************************************** */


const mockModels = {
    '#server/services/accessRequest/accessRequestService': {

    },
};


/* **************************************************************************************************
 * TESTS
 * *********************************************************************************************** */

describe.only('contactController.contact()', () => {
    const req: any = {};
    let res;
    let stubs;
    let emailStub;

    const user = generateFakeUser();

    const nationalAdmins = [
        generateFakeUser(),
        generateFakeUser(),
    ];

    const regionalAdmins = [
        generateFakeUser(),
        generateFakeUser(),
        generateFakeUser(),
    ];


    beforeEach(() => {
        emailStub = sinon.stub(mailService, 'send');
        stubs = {
            getNationalAdmins: sinon.stub(userModel, 'getNationalAdmins'),
            findOne: sinon.stub(userModel, 'findOne'),
            getAdminsFor: sinon.stub(userModel, 'getAdminsFor'),
            create: sinon.stub(userService, 'create'),
            handleNewAccessRequest: sinon.stub(accessRequestService, 'handleNewAccessRequest'),
        };

        stubs.getNationalAdmins.resolves(nationalAdmins);
        stubs.findOne.resolves(user);
        stubs.getAdminsFor.resolves(regionalAdmins);
    });
    afterEach(() => {
        sinon.restore();
    });


    describe('Success cases', () => {
        it('Should a simple message', async () => {
            const { default: contact } = await rewiremock.module(() => import('#server/controllers/contactController/contact'), mockModels);

            req.body = {
                access_request_message: 'ceci est un message',
                email: 'john.doe@gmail.com',
                first_name: 'john',
                last_name: 'doe',
                legal: true,
                request_type: ['help'],
            };
            res = mockRes();

            await contact(req, res, sinon.stub());

            // It should send a message to all national admins and ensure that it returns a 200
            expect(res.status).to.have.been.calledOnceWith(200);
            expect(emailStub).to.have.been.callCount(nationalAdmins.length);
        });

        it('Should handle an access request for a non actor', async () => {
            const { default: contact } = await rewiremock.module(() => import('#server/controllers/contactController/contact'), mockModels);

            req.body = {
                access_request_message: 'ceci est un message',
                email: 'john.doe@gmail.com',
                first_name: 'john',
                last_name: 'doe',
                legal: true,
                request_type: ['access-request'],
                is_actor: false,
            };
            res = mockRes();

            await contact(req, res, sinon.stub());

            // It should send a message to all national admins and ensure that it returns a 200
            expect(res.status).to.have.been.calledOnceWith(200);
            expect(emailStub).to.have.been.callCount(nationalAdmins.length);
        });

        it('Should handle an access request for a public_establishment', async () => {
            const createUserStub = sinon.stub();
            createUserStub.returns({});

            stubs.findOneByEmail = sinon.stub(userModel, 'findOneByEmail');
            stubs.findOneByEmail.resolves(null);

            const accessRequestStub = sinon.stub({
                handleNewAccessRequest: () => { },
            });
            const { default: contact } = await rewiremock.module(
                () => import('#server/controllers/contactController/contact'),
                {
                    // Fake userService db models calls
                    '#server/models/organizationCategoryModel': {
                        findOneById: () => 'something',
                    },
                    '#server/models/organizationTypeModel': {
                        findOneById: () => ({ organization_category: 'public_establishment' }),
                    },
                    '#server/models/organizationModel': {
                        findOneById: () => ({ fk_type: 12 }),
                    },
                    '#server/services/createUser': createUserStub,
                    '#server/services/accessRequest/accessRequestService': accessRequestStub,
                },
            );

            req.body = {
                request_type: ['access-request'],
                is_actor: true,
                access_request_message: "ceci est une demande d'acces",
                last_name: 'John',
                first_name: 'Doe',
                email: 'john.doe@gmail.com',
                phone: '0102030405',
                organization_category: 'public_establishment',
                organization_category_full: {},
                organization_type: '12',
                organization_type_full: {},
                organization_public: '40765',
                organization_full: {
                    id: 92,
                },
                position: 'test',
                legal: true,
            };
            res = mockRes();

            await contact(req, res, sinon.stub());

            // It should send a message to all admins and ensure that it returns a 200
            expect(createUserStub).to.have.been.calledOnceWith({
                last_name: 'John',
                first_name: 'Doe',
                email: 'john.doe@gmail.com',
                organization: 92,
                phone: '0102030405',
                new_association: false,
                new_association_name: null,
                new_association_abbreviation: null,
                departement: null,
                position: 'test',
                access_request_message: "ceci est une demande d'acces",
                created_by: null,
            });
            expect(accessRequestStub.handleNewAccessRequest).to.have.been.calledWith(user);
            expect(res.status).to.have.been.calledOnceWith(200);
        });

        it('Should handle an access request for a territorial_collectivity', async () => {
            const createUserStub = sinon.stub();
            createUserStub.returns({});
            stubs.findOneByEmail = sinon.stub(userModel, 'findOneByEmail');
            stubs.findOneByEmail.resolves(null);
            stubs.handleNewAccessRequest.resolves({});
            const { default: contact } = await rewiremock.module(
                () => import('#server/controllers/contactController/contact'),
                {
                    // Fake userService db models calls
                    '#server/models/organizationCategoryModel': {
                        findOneById: () => 'something',
                    },
                    '#server/models/organizationModel': {
                        findOneById: () => ({ organization_category: 'territorial_collectivity' }),
                        findOneByLocation: () => ({ fk_category: 'territorial_collectivity' }),
                    },
                    '#server/services/createUser': createUserStub,
                },
            );

            req.body = {
                request_type: ['access-request'],
                is_actor: true,
                access_request_message: "ceci est une demande d'acces",
                last_name: 'doe',
                first_name: 'john',
                email: 'john.doe@gmail.com',
                phone: '',
                organization_category: 'territorial_collectivity',
                territorial_collectivity: {
                    category: 'Commune',
                    data: { code: '40101', type: 'city' },
                    code: '40101',
                    type: 'city',
                    id: '40101',
                    label: '(40) Gaas',
                },
                organization_full: {
                    id: 92,
                },
                position: 'test',
                legal: true,
            };
            res = mockRes();

            await contact(req, res, sinon.stub());

            // It should send a message to all admins and ensure that it returns a 200
            expect(createUserStub).to.have.been.calledOnceWith({
                last_name: 'doe',
                first_name: 'john',
                email: 'john.doe@gmail.com',
                organization: 92,
                new_association: false,
                new_association_name: null,
                new_association_abbreviation: null,
                departement: null,
                phone: '',
                position: 'test',
                access_request_message: "ceci est une demande d'acces",
                created_by: null,
            });
            expect(stubs.handleNewAccessRequest).to.have.been.calledWith(user);
            expect(res.status).to.have.been.calledOnceWith(200);
        });

        it('Should handle an access request for a administration', async () => {
            const createUserStub = sinon.stub();
            createUserStub.returns({});
            stubs.findOneByEmail = sinon.stub(userModel, 'findOneByEmail');
            stubs.findOneByEmail.resolves(null);
            stubs.handleNewAccessRequest.resolves({});
            const { default: contact } = await rewiremock.module(
                () => import('#server/controllers/contactController/contact'),
                {
                    // Fake userService db models calls
                    '#server/models/organizationCategoryModel': {
                        findOneById: () => 'something',
                    },
                    '#server/models/organizationModel': {
                        findOneById: () => ({ fk_category: 'administration' }),
                    },
                    '#server/services/createUser': createUserStub,
                },
            );

            req.body = {
                request_type: ['access-request'],
                is_actor: true,
                access_request_message: "ceci est une demande d'acces",
                last_name: 'doe',
                first_name: 'john',
                email: 'john.doe@gmail.com',
                phone: '',
                organization_category: 'administration',
                organization_administration: '40752',
                organization_full: {
                    id: 92,
                },
                position: 'rte',
                legal: true,
            };
            res = mockRes();

            await contact(req, res, sinon.stub());

            // It should send a message to all admins and ensure that it returns a 200
            expect(createUserStub).to.have.been.calledOnceWith({
                last_name: 'doe',
                first_name: 'john',
                email: 'john.doe@gmail.com',
                phone: '',
                organization: 92,
                new_association: false,
                new_association_name: null,
                new_association_abbreviation: null,
                departement: null,
                position: 'rte',
                access_request_message: "ceci est une demande d'acces",
                created_by: null,
            });
            expect(stubs.handleNewAccessRequest).to.have.been.calledWith(user);
            expect(res.status).to.have.been.calledOnceWith(200);
        });

        it('Should handle an access request for an existing association', async () => {
            const createUserStub = sinon.stub();
            createUserStub.returns({});
            stubs.findOneByEmail = sinon.stub(userModel, 'findOneByEmail');
            stubs.findOneByEmail.resolves(null);
            stubs.handleNewAccessRequest.resolves({});

            const { default: contact } = await rewiremock.module(
                () => import('#server/controllers/contactController/contact'),
                {
                    // Fake userService db models calls
                    '#server/models/organizationCategoryModel': {
                        findOneById: () => 'something',
                    },
                    '#server/models/organizationModel': {
                        findAssociationName: () => 'something',
                    },
                    '#server/models/departementModel': {
                        findOne: () => 'something',
                    },
                    '#server/services/createUser': createUserStub,
                },
            );

            req.body = {
                request_type: ['access-request'],
                is_actor: true,
                access_request_message: "ceci est une demande d'acces",
                last_name: 'doe',
                first_name: 'john',
                email: 'john.doe@gmail.com',
                phone: '',
                organization_category: 'association',
                association: 'Accueil coopération insertion pour les nouveaux arrivants',
                association_name: 'Accueil coopération insertion pour les nouveaux arrivants',
                association_abbreviation: 'ACINA',
                departement: '92',
                new_association: false,
                organization_full: {
                    id: 92,
                },
                position: 'rte',
                legal: true,
            };
            res = mockRes();

            await contact(req, res, sinon.stub());

            // It should send a message to all admins and ensure that it returns a 200
            expect(createUserStub).to.have.been.calledOnceWith({
                last_name: 'doe',
                first_name: 'john',
                email: 'john.doe@gmail.com',
                phone: '',
                organization: 92,
                new_association: false,
                new_association_name: null,
                new_association_abbreviation: null,
                departement: '92',
                position: 'rte',
                access_request_message: "ceci est une demande d'acces",
                created_by: null,
            });
            expect(stubs.handleNewAccessRequest).to.have.been.calledWith(user);
            expect(res.status).to.have.been.calledOnceWith(200);
        });

        it('Should handle an access request for a new association', async () => {
            const createUserStub = sinon.stub();
            createUserStub.returns({});

            stubs.findOneByEmail = sinon.stub(userModel, 'findOneByEmail');
            stubs.findOneByEmail.resolves(null);
            stubs.handleNewAccessRequest.resolves({});

            const { default: contact } = await rewiremock.module(
                () => import('#server/controllers/contactController/contact'),
                {
                    // Fake userService db models calls
                    '#server/models/organizationCategoryModel': {
                        findOneById: () => 'something',
                    },
                    '#server/models/organizationModel': {
                        findAssociationName: () => null,
                    },
                    '#server/models/departementModel': {
                        findOne: () => 'something',
                    },
                    '#server/services/createUser': createUserStub,
                },
            );

            req.body = {
                request_type: ['access-request'],
                is_actor: true,
                access_request_message: "ceci est une demande d'acces",
                last_name: 'doe',
                first_name: 'john',
                email: 'john.doe@gmail.com',
                phone: '',
                organization_category: 'association',
                association: 'Accueil coopération insertion pour les nouveaux arrivants',
                association_name: 'Accueil coopération insertion pour les nouveaux arrivants',
                association_abbreviation: 'ACINA',
                departement: '04',
                new_association: true,
                new_association_name: 'Accueil coopération insertion pour les nouveaux arrivants',
                new_association_abbreviation: 'ACINA',
                position: 'rte',
                legal: true,
            };
            res = mockRes();

            await contact(req, res, sinon.stub());

            // It should send a message to all admins and ensure that it returns a 200
            expect(createUserStub).to.have.been.calledOnceWith({
                last_name: 'doe',
                first_name: 'john',
                email: 'john.doe@gmail.com',
                phone: '',
                organization: null,
                new_association: true,
                new_association_name: 'Accueil coopération insertion pour les nouveaux arrivants',
                new_association_abbreviation: 'ACINA',
                departement: '04',
                position: 'rte',
                access_request_message: "ceci est une demande d'acces",
                created_by: null,
            });
            expect(stubs.handleNewAccessRequest).to.have.been.calledWith(user);
            expect(res.status).to.have.been.calledOnceWith(200);
        });
    });
});
