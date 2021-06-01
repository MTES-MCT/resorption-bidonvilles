/* eslint-disable global-require */

/* **************************************************************************************************
 * TOOLS
 * *********************************************************************************************** */

const chai = require('chai');
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const rewiremock = require('rewiremock/node');

const { expect } = require('chai');
const { mockRes } = require('sinon-express-mock');


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
        default_export: [
            global.generate('string'),
            global.generate('string'),
            global.generate('string'),
        ],
    };
}


/* **************************************************************************************************
 * FIXTURES
 * *********************************************************************************************** */


const emailStub = sinon.stub();


const mockModels = {
    '#server/services/mailService': {
        send: emailStub,
    },
    '#server/services/accessRequest/accessRequestService': {

    },
};


const controllerMockModels = {
    user: {
        getNationalAdmins: sinon.stub(),
        findOne: sinon.stub(),
        getAdminsFor: sinon.stub(),
    },
};


/* **************************************************************************************************
 * TESTS
 * *********************************************************************************************** */

describe.only('contactController.contact()', () => {
    const req = {};
    let res;

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

    controllerMockModels.user.getNationalAdmins.resolves(nationalAdmins);
    controllerMockModels.user.findOne.resolves(user);
    controllerMockModels.user.getAdminsFor.resolves(regionalAdmins);

    beforeEach(() => {
        emailStub.reset();
    });

    describe('Success cases', () => {
        it('Should a simple message', async () => {
            const controller = rewiremock.proxy('#server/controllers/contactController', mockModels)(controllerMockModels);

            req.body = {
                access_request_message: 'ceci est un message',
                email: 'john.doe@gmail.com',
                first_name: 'john',
                last_name: 'doe',
                legal: true,
                request_type: ['help'],
            };
            res = mockRes();

            await controller.contact(req, res);

            // It should send a message to all national admins and ensure that it returns a 200
            expect(res.status).to.have.been.calledOnceWith(200);
            expect(emailStub).to.have.been.callCount(nationalAdmins.length);
        });

        it('Should handle an access request for a non actor', async () => {
            const controller = rewiremock.proxy('#server/controllers/contactController', mockModels)(controllerMockModels);

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

            await controller.contact(req, res);

            // It should send a message to all national admins and ensure that it returns a 200
            expect(res.status).to.have.been.calledOnceWith(200);
            expect(emailStub).to.have.been.callCount(nationalAdmins.length);
        });

        it('Should handle an access request for a public_establishment', async () => {
            const createUserStub = sinon.stub();
            createUserStub.returns({});

            const accessRequestStub = sinon.stub({
                handleNewAccessRequest: () => {},
            });
            const controller = rewiremock.proxy('#server/controllers/contactController', {
                // Fake userService db models calls
                '#server/models/userModel': module.exports = () => ({
                    findOneByEmail: () => null,
                }),
                '#server/models/organizationCategoryModel': module.exports = () => ({
                    findOneById: () => 'something',
                }),
                '#server/models/organizationTypeModel': module.exports = () => ({
                    findOneById: () => ({ organization_category: 'public_establishment' }),
                }),
                '#server/models/organizationModel': module.exports = () => ({
                    findOneById: () => ({ fk_type: 12 }),
                }),
                '#server/services/createUser': module.exports = createUserStub,
                '#server/services/accessRequest/accessRequestService': module.exports = accessRequestStub,
            })(controllerMockModels);

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

            await controller.contact(req, res);

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

            const accessRequestStub = sinon.stub({
                handleNewAccessRequest: () => {},
            });
            const controller = rewiremock.proxy('#server/controllers/contactController', {
                // Fake userService db models calls
                '#server/models/userModel': module.exports = () => ({
                    findOneByEmail: () => null,
                }),
                '#server/models/organizationCategoryModel': module.exports = () => ({
                    findOneById: () => 'something',
                }),
                '#server/models/organizationModel': module.exports = () => ({
                    findOneById: () => ({ organization_category: 'territorial_collectivity' }),
                    findOneByLocation: () => ({ fk_category: 'territorial_collectivity' }),
                }),
                '#server/services/createUser': module.exports = createUserStub,
                '#server/services/accessRequest/accessRequestService': module.exports = accessRequestStub,
            })(controllerMockModels);

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

            await controller.contact(req, res);

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
            expect(accessRequestStub.handleNewAccessRequest).to.have.been.calledWith(user);
            expect(res.status).to.have.been.calledOnceWith(200);
        });

        it('Should handle an access request for a administration', async () => {
            const createUserStub = sinon.stub();
            createUserStub.returns({});

            const accessRequestStub = sinon.stub({
                handleNewAccessRequest: () => {},
            });
            const controller = rewiremock.proxy('#server/controllers/contactController', {
                // Fake userService db models calls
                '#server/models/userModel': module.exports = () => ({
                    findOneByEmail: () => null,
                }),
                '#server/models/organizationCategoryModel': module.exports = () => ({
                    findOneById: () => 'something',
                }),
                '#server/models/organizationModel': module.exports = () => ({
                    findOneById: () => ({ fk_category: 'administration' }),
                }),
                '#server/services/createUser': module.exports = createUserStub,
                '#server/services/accessRequest/accessRequestService': module.exports = accessRequestStub,
            })(controllerMockModels);

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

            await controller.contact(req, res);

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
            expect(accessRequestStub.handleNewAccessRequest).to.have.been.calledWith(user);
            expect(res.status).to.have.been.calledOnceWith(200);
        });

        it('Should handle an access request for an existing association', async () => {
            const createUserStub = sinon.stub();
            createUserStub.returns({});

            const accessRequestStub = sinon.stub({
                handleNewAccessRequest: () => {},
            });
            const controller = rewiremock.proxy('#server/controllers/contactController', {
                // Fake userService db models calls
                '#server/models/userModel': module.exports = () => ({
                    findOneByEmail: () => null,
                }),
                '#server/models/organizationCategoryModel': module.exports = () => ({
                    findOneById: () => 'something',
                }),
                '#server/models/organizationModel': module.exports = () => ({
                    findAssociationName: () => 'something',
                }),
                '#server/models/departementModel': module.exports = () => ({
                    findOne: () => 'something',
                }),
                '#server/services/createUser': module.exports = createUserStub,
                '#server/services/accessRequest/accessRequestService': module.exports = accessRequestStub,
            })(controllerMockModels);

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

            await controller.contact(req, res);

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
            expect(accessRequestStub.handleNewAccessRequest).to.have.been.calledWith(user);
            expect(res.status).to.have.been.calledOnceWith(200);
        });

        it('Should handle an access request for a new association', async () => {
            const createUserStub = sinon.stub();
            createUserStub.returns({});

            const accessRequestStub = sinon.stub({
                handleNewAccessRequest: () => {},
            });
            const controller = rewiremock.proxy('#server/controllers/contactController', {
                // Fake userService db models calls
                '#server/models/userModel': module.exports = () => ({
                    findOneByEmail: () => null,
                }),
                '#server/models/organizationCategoryModel': module.exports = () => ({
                    findOneById: () => 'something',
                }),
                '#server/models/organizationModel': module.exports = () => ({
                    findAssociationName: () => null,
                }),
                '#server/models/departementModel': module.exports = () => ({
                    findOne: () => 'something',
                }),
                '#server/services/createUser': module.exports = createUserStub,
                '#server/services/accessRequest/accessRequestService': module.exports = accessRequestStub,
            })(controllerMockModels);

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

            await controller.contact(req, res);

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
            expect(accessRequestStub.handleNewAccessRequest).to.have.been.calledWith(user);
            expect(res.status).to.have.been.calledOnceWith(200);
        });
    });
});
