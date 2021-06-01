const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const { mockReq, mockRes } = require('sinon-express-mock');
const { makeMockModels } = require('sequelize-test-helpers');
const proxyquire = require('proxyquire');
const jwt = require('jsonwebtoken');

const { auth: authConfig } = require('#server/config');

const mockModels = makeMockModels({
    User: {
        findOne: sinon.stub(),
    },
});

const mockAuth = {
    generateAccessTokenFor: sinon.stub(),
    hashPassword: sinon.stub(),
    generateSalt: sinon.stub(),
    getAccountActivationLink: sinon.stub(),
};

// @todo: i promise this madness of "mockModels" here, "otherMockModels" there won't last for long...
const otherMockModels = {
    user: {
        create: sinon.stub(),
        findAll: sinon.stub(),
        findOne: sinon.stub(),
        findOneByEmail: sinon.stub(),
        update: sinon.stub(),
        deactivate: sinon.stub(),
    },
    departement: {
        findOne: sinon.stub(),
    },
    role: {
        findOne: sinon.stub(),
    },
};

const {
    list, signin, create, me, setDefaultExport, getActivationLink, checkActivationToken, activate,
} = proxyquire('#server/controllers/userController', {
    '#db/models': mockModels,
    '#server/utils/auth': mockAuth,
})(otherMockModels);

const { expect } = chai;
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
        default_export: [
            global.generate('string'),
            global.generate('string'),
            global.generate('string'),
        ],
    };
}

describe('Controllers/User', () => {
    let httpRes;
    let httpReq;
    let response;

    describe('.list()', () => {
        describe('if the query succeeds', () => {
            let users;
            beforeEach(async () => {
                httpReq = mockReq({});
                httpRes = mockRes();
                users = [
                    generateFakeUser(),
                    generateFakeUser(),
                    generateFakeUser(),
                ];
                otherMockModels.user.findAll.resolves(users);

                await list(httpReq, httpRes);
                [response] = httpRes.send.getCalls()[0].args;
            });

            it('it responds with a 200', () => {
                expect(httpRes.status).to.have.been.calledWith(200);
            });

            it('it responds with the proper list of users', () => {
                expect(response).to.be.eql(
                    users.map(({
                        id, email, departement, first_name, last_name, company, active,
                    }) => ({
                        id,
                        email,
                        departement,
                        first_name,
                        last_name,
                        company,
                        active,
                    })),
                );
            });
        });

        describe('if the query fails', () => {
            let error;
            beforeEach(async () => {
                httpReq = mockReq({});
                httpRes = mockRes();
                error = global.generate('string');
                otherMockModels.user.findAll.rejects(new Error(error));

                await list(httpReq, httpRes);
                [response] = httpRes.send.getCalls()[0].args;
            });

            it('it responds with a 500', () => {
                expect(httpRes.status).to.have.been.calledWith(500);
            });

            it('it responds with the proper error messages', () => {
                expect(response).to.be.eql({
                    error: {
                        user_message: 'Une erreur est survenue lors de la récupération des données en base',
                        developer_message: error,
                    },
                });
            });
        });
    });

    describe('.signin()', () => {
        describe('if the input email is not a string', () => {
            beforeEach(async () => {
                httpReq = mockReq({
                    body: {
                        email: global.generate().not('string'),
                    },
                });
                httpRes = mockRes();

                await signin(httpReq, httpRes);
                [response] = httpRes.send.getCalls()[0].args;
            });

            it('it responds with a 400', () => {
                expect(httpRes.status).to.have.been.calledWith(400);
            });

            it('it responds with a success = false', () => {
                expect(response.success).to.be.false;
            });

            it('it responds with the proper error messages', () => {
                expect(response.error).to.be.eql({
                    user_message: 'L\'adresse e-mail est invalide',
                    developer_message: 'The email address must be a string',
                });
            });
        });

        describe('if the input password is not a string', () => {
            beforeEach(async () => {
                httpReq = mockReq({
                    body: {
                        email: global.generate('string'),
                        password: global.generate().not('string'),
                    },
                });
                httpRes = mockRes();

                await signin(httpReq, httpRes);
                [response] = httpRes.send.getCalls()[0].args;
            });

            it('it responds with a 400', () => {
                expect(httpRes.status).to.have.been.calledWith(400);
            });

            it('it responds with a success = false', () => {
                expect(response.success).to.be.false;
            });

            it('it responds with the proper error messages', () => {
                expect(response.error).to.be.eql({
                    user_message: 'Le mot de passe est invalide',
                    developer_message: 'The password must be a string',
                });
            });
        });

        describe('if the input email does not match an existing user', () => {
            beforeEach(async () => {
                const email = global.generate('string');
                httpReq = mockReq({
                    body: {
                        email,
                        password: global.generate('string'),
                    },
                });
                httpRes = mockRes();
                otherMockModels.user.findOneByEmail.withArgs(email, true).resolves(null);

                await signin(httpReq, httpRes);
                [response] = httpRes.send.getCalls()[0].args;
            });

            it('it responds with a 403', () => {
                expect(httpRes.status).to.have.been.calledWith(403);
            });

            it('it responds with a success = false', () => {
                expect(response.success).to.be.false;
            });

            it('it responds with the proper error messages', () => {
                expect(response.error).to.be.eql({
                    user_message: 'Ces identifiants sont incorrects',
                    developer_message: 'The given credentials do not match an existing user',
                });
            });
        });

        describe('if the input password does not match the user\'s password', () => {
            beforeEach(async () => {
                const email = global.generate('string');

                httpReq = mockReq({
                    body: {
                        email,
                        password: global.generate('string'),
                    },
                });
                httpRes = mockRes();
                otherMockModels.user.findOneByEmail.withArgs(email, true).resolves({
                    id: global.generate('number'),
                    email,
                    password: global.generate('string'),
                    active: true,
                });

                await signin(httpReq, httpRes);
                [response] = httpRes.send.getCalls()[0].args;
            });

            it('it responds with a 403', () => {
                expect(httpRes.status).to.have.been.calledWith(403);
            });

            it('it responds with a success = false', () => {
                expect(response.success).to.be.false;
            });

            it('it responds with the proper error messages', () => {
                expect(response.error).to.be.eql({
                    user_message: 'Ces identifiants sont incorrects',
                    developer_message: 'The given credentials do not match an existing user',
                });
            });
        });

        describe('if the credentials match an existing user', () => {
            let fakeUser;
            let plainPassword;
            beforeEach(() => {
                plainPassword = global.generate('string');
                fakeUser = {
                    id: global.generate('number'),
                    email: global.generate('string'),
                    active: true,
                    password: global.generate('string'),
                    salt: global.generate('string'),
                };
            });

            describe('if that user is not active', () => {
                beforeEach(async () => {
                    httpReq = mockReq({
                        body: {
                            email: fakeUser.email,
                            password: plainPassword,
                        },
                    });
                    httpRes = mockRes();
                    otherMockModels.user.findOneByEmail.withArgs(fakeUser.email, true).resolves(
                        Object.assign({}, fakeUser, { active: false }),
                    );

                    await signin(httpReq, httpRes);
                    [response] = httpRes.send.getCalls()[0].args;
                });

                it('it responds with a 400', () => {
                    expect(httpRes.status).to.have.been.calledWith(400);
                });

                it('it responds with a success = false', () => {
                    expect(response.success).to.be.false;
                });

                it('it responds with the proper error messages', () => {
                    expect(response.error).to.be.eql({
                        user_message: 'Votre compte doit être activé avant utilisation',
                        developer_message: 'The user is not activated yet',
                    });
                });
            });

            describe('if that user is active', () => {
                let fakeToken;
                beforeEach(async () => {
                    fakeToken = global.generate('string');

                    httpReq = mockReq({
                        body: {
                            email: fakeUser.email,
                            password: plainPassword,
                        },
                    });
                    httpRes = mockRes();
                    otherMockModels.user.findOneByEmail.withArgs(fakeUser.email, true).resolves(fakeUser);
                    mockAuth.generateAccessTokenFor.withArgs(fakeUser).returns(fakeToken);
                    mockAuth.hashPassword.withArgs(plainPassword, fakeUser.salt).returns(fakeUser.password);

                    await signin(httpReq, httpRes);
                    [response] = httpRes.send.getCalls()[0].args;
                });

                it('it responds with a 200', () => {
                    expect(httpRes.status).to.have.been.calledWith(200);
                });

                it('it responds with a success = true', () => {
                    expect(response.success).to.be.true;
                });

                it('it responds with a new JWT token', () => {
                    expect(response.token).to.be.eql(fakeToken);
                });
            });
        });
    });

    describe('.me()', () => {
        let fakeUser;
        beforeEach(async () => {
            const fakeId = global.generate('number');
            fakeUser = {
                id: fakeId,
                email: global.generate('string'),
                salt: global.generate('string'),
                password: global.generate('string'),
            };
            httpReq = mockReq({
                user: fakeUser,
            });
            httpRes = mockRes();

            await me(httpReq, httpRes);
            [response] = httpRes.send.getCalls()[0].args;
        });

        it('it responds with a 200', () => {
            expect(httpRes.status).to.have.been.calledWith(200);
        });

        it('it responds with the current user', () => {
            expect(response).to.be.eql(fakeUser);
        });
    });

    describe('.create()', () => {
        const validInput = {
            email: global.generate('string'),
            firstName: global.generate('string'),
            lastName: global.generate('string'),
            company: global.generate('string'),
            departement: global.generate('string'),
            role: global.generate('number'),
            dataOwnerAgreement: true,
        };

        const errorDataSet = [
            // email errors
            {
                testName: 'the email is missing',
                input: {
                    email: undefined,
                },
                code: 400,
                error: {
                    fields: {
                        email: ['L\'adresse e-mail est obligatoire'],
                    },
                },
            },
            {
                testName: 'the email is empty',
                input: {
                    email: '       ',
                },
                code: 400,
                error: {
                    fields: {
                        email: ['L\'adresse e-mail est obligatoire'],
                    },
                },
            },
            {
                testName: 'the email is already used by another user',
                input: {
                    email: 'whatever',
                },
                setup() {
                    otherMockModels.user.findOneByEmail.withArgs('whatever').resolves({});
                },
                code: 400,
                error: {
                    fields: {
                        email: ['Cette adresse e-mail est déjà utilisée'],
                    },
                },
            },
            {
                testName: 'the query testing the email\'s unicity fails',
                setup() {
                    otherMockModels.user.findOneByEmail.withArgs(validInput.email).rejects('Some error');
                },
                code: 500,
                error: {
                    user_message: 'Une erreur est survenue lors de la lecture de la base de données',
                    developer_message: 'Failed checking email\'s unicity',
                },
            },

            // first name errors
            {
                testName: 'the first name is missing',
                input: {
                    firstName: undefined,
                },
                code: 400,
                error: {
                    fields: {
                        firstName: ['Le prénom est obligatoire'],
                    },
                },
            },
            {
                testName: 'the first name is empty',
                input: {
                    firstName: '       ',
                },
                code: 400,
                error: {
                    fields: {
                        firstName: ['Le prénom est obligatoire'],
                    },
                },
            },

            // last name errors
            {
                testName: 'the last name is missing',
                input: {
                    lastName: undefined,
                },
                code: 400,
                error: {
                    fields: {
                        lastName: ['Le nom de famille est obligatoire'],
                    },
                },
            },
            {
                testName: 'the last name is empty',
                input: {
                    lastName: '       ',
                },
                code: 400,
                error: {
                    fields: {
                        lastName: ['Le nom de famille est obligatoire'],
                    },
                },
            },

            // company errors
            {
                testName: 'the company is missing',
                input: {
                    company: undefined,
                },
                code: 400,
                error: {
                    fields: {
                        company: ['La structure est obligatoire'],
                    },
                },
            },
            {
                testName: 'the company is empty',
                input: {
                    company: '       ',
                },
                code: 400,
                error: {
                    fields: {
                        company: ['La structure est obligatoire'],
                    },
                },
            },

            // departement errors
            {
                testName: 'the departement is missing',
                input: {
                    departement: undefined,
                },
                code: 400,
                error: {
                    fields: {
                        departement: ['Le département est obligatoire'],
                    },
                },
            },
            {
                testName: 'the departement does not exist in database',
                input: {
                    departement: 'whatever',
                },
                setup() {
                    otherMockModels.departement.findOne.withArgs('whatever').resolves(null);
                },
                code: 400,
                error: {
                    fields: {
                        departement: ['Ce département n\'est pas reconnu'],
                    },
                },
            },
            {
                testName: 'the query checking the departement\'s existence fails',
                setup() {
                    otherMockModels.departement.findOne.withArgs(validInput.departement).rejects('Some error');
                },
                code: 500,
                error: {
                    user_message: 'Une erreur est survenue lors de la lecture de la base de données',
                    developer_message: 'Failed checking departement\'s existence',
                },
            },

            // role errors
            {
                testName: 'the role is missing',
                input: {
                    role: undefined,
                },
                code: 400,
                error: {
                    fields: {
                        role: ['Le rôle est obligatoire'],
                    },
                },
            },
            {
                testName: 'the role does not exist in database',
                input: {
                    role: 99,
                },
                setup() {
                    otherMockModels.role.findOne.withArgs(99).resolves(null);
                },
                code: 400,
                error: {
                    fields: {
                        role: ['Ce rôle n\'existe pas'],
                    },
                },
            },
            {
                testName: 'the query checking the role\'s existence fails',
                setup() {
                    otherMockModels.role.findOne.withArgs(validInput.role).rejects('Some error');
                },
                code: 500,
                error: {
                    user_message: 'Une erreur est survenue lors de la lecture de la base de données',
                    developer_message: 'Failed checking role\'s existence',
                },
            },

            // data owner's agreement errors
            {
                testName: 'the data owner\'s agreement is missing',
                input: {
                    dataOwnerAgreement: undefined,
                },
                code: 400,
                error: {
                    fields: {
                        dataOwnerAgreement: ['L\'accord du propriétaire des données doit être confirmée'],
                    },
                },
            },

            {
                testName: 'the data owner\'s agreement is not provided',
                input: {
                    dataOwnerAgreement: false,
                },
                code: 400,
                error: {
                    fields: {
                        dataOwnerAgreement: ['L\'accord du propriétaire des données est obligatoire'],
                    },
                },
            },
        ];

        errorDataSet.forEach(({
            testName, input, error, setup, code,
        }) => {
            describe(`if ${testName}`, () => {
                beforeEach(async () => {
                    httpReq = mockReq({
                        body: Object.assign({}, validInput, input || {}),
                    });
                    httpRes = mockRes();

                    otherMockModels.departement.findOne.withArgs(validInput.departement).resolves({});
                    otherMockModels.role.findOne.withArgs(validInput.role).resolves({});
                    otherMockModels.user.findOneByEmail.withArgs(validInput.email).resolves(null);

                    if (setup) {
                        setup();
                    }

                    await create(httpReq, httpRes);
                    [response] = httpRes.send.getCalls()[0].args;
                });

                it(`it responds with a ${code}`, () => {
                    expect(httpRes.status).to.have.been.calledWith(code);
                });

                it('it responds with the proper error messages', () => {
                    expect(response).to.be.eql({
                        error: Object.assign({
                            user_message: 'Certaines informations saisies sont incorrectes',
                            developer_message: 'Input data is invalid',
                        }, error),
                    });
                });
            });
        });

        describe('if the whole input is valid', () => {
            describe('if the insertion query fails', () => {
                let error;
                beforeEach(async () => {
                    error = global.generate('string');

                    httpReq = mockReq({
                        body: validInput,
                    });
                    httpRes = mockRes();

                    otherMockModels.departement.findOne.withArgs(validInput.departement).resolves({});
                    otherMockModels.role.findOne.withArgs(validInput.role).resolves({});
                    otherMockModels.user.findOneByEmail.withArgs(validInput.email).resolves(null);
                    otherMockModels.user.create.rejects(error);

                    await create(httpReq, httpRes);
                    [response] = httpRes.send.getCalls()[0].args;
                });

                it('it responds with a 500', () => {
                    expect(httpRes.status).to.have.been.calledWith(500);
                });

                it('it responds with the proper error messages', () => {
                    expect(response).to.be.eql({
                        error: {
                            user_message: 'Une erreur est survenue lors de l\'écriture en base de données',
                            developer_message: 'Failed inserting the new user into database',
                        },
                    });
                });
            });

            describe('if the insertion query succeeds', () => {
                let accountActivationLink;
                beforeEach(async () => {
                    const newUserId = global.generate('number');

                    httpReq = mockReq({
                        body: Object.assign({}, validInput, {
                            email: `  ${validInput.email}   `,
                            firstName: `  ${validInput.firstName}   `,
                            lastName: `  ${validInput.lastName}   `,
                            company: `  ${validInput.company}   `,
                        }),
                    });
                    httpRes = mockRes();

                    const fakeSalt = global.generate('string');
                    mockAuth.generateSalt.returns(fakeSalt);
                    otherMockModels.departement.findOne.withArgs(validInput.departement).resolves({});
                    otherMockModels.role.findOne.withArgs(validInput.role).resolves({});
                    otherMockModels.user.findOneByEmail.withArgs(validInput.email).resolves(null);
                    otherMockModels.user.create.withArgs({
                        email: validInput.email,
                        firstName: validInput.firstName,
                        lastName: validInput.lastName,
                        company: validInput.company,
                        departement: validInput.departement,
                        role: validInput.role,
                        salt: fakeSalt,
                        password: null,
                    }).resolves(newUserId);

                    accountActivationLink = global.generate('string');
                    mockAuth.getAccountActivationLink.withArgs({
                        id: newUserId,
                        email: validInput.email,
                    }).returns(accountActivationLink);

                    await create(httpReq, httpRes);
                    [response] = httpRes.send.getCalls()[0].args;
                });

                it('it responds with a 200', () => {
                    expect(httpRes.status).to.have.been.calledWith(200);
                });

                it('it responds with an activation link', () => {
                    expect(response).to.be.eql({
                        activationLink: accountActivationLink,
                    });
                });
            });
        });
    });

    describe('.setDefaultExport()', () => {
        let fakeUser;
        beforeEach(async () => {
            const fakeId = global.generate('number');
            fakeUser = {
                id: fakeId,
                email: global.generate('string'),
                salt: global.generate('string'),
                password: global.generate('string'),
            };
        });

        async function request(body) {
            httpReq = mockReq({
                user: fakeUser,
                body,
            });
            httpRes = mockRes();

            await setDefaultExport(httpReq, httpRes);
            [response] = httpRes.send.getCalls()[0].args;
        }

        describe('if there is not export value in the body', () => {
            beforeEach(async () => {
                await request({});
            });

            it('it responds with a 400', () => {
                expect(httpRes.status).to.have.been.calledWith(400);
            });

            it('it responds with a success = false', () => {
                expect(response.success).to.be.false;
            });

            it('it responds with the proper error messages', () => {
                expect(response.error).to.be.eql({
                    user_message: 'Les nouvelles préférences d\'export sont manquantes',
                    developer_message: 'The new default export value is missing',
                });
            });
        });

        describe('if the query fails', () => {
            let error;
            beforeEach(async () => {
                const fakeExport = global.generate('string');
                error = global.generate('string');
                otherMockModels.user.update.withArgs(fakeUser.id, { defaultExport: fakeExport }).rejects(new Error(error));

                await request({
                    export: fakeExport,
                });
            });

            it('it responds with a 500', () => {
                expect(httpRes.status).to.have.been.calledWith(500);
            });

            it('it responds with a success = false', () => {
                expect(response.success).to.be.false;
            });

            it('it responds with the proper error messages', () => {
                expect(response.error).to.be.eql({
                    user_message: 'La sauvegarde de vos préférences a échoué',
                    developer_message: `Failed to store the new default-export into database: ${error}`,
                });
            });
        });

        describe('if the query succeeds', () => {
            beforeEach(async () => {
                const fakeExport = global.generate('string');
                otherMockModels.user.update.withArgs(fakeUser.id, { defaultExport: fakeExport }).resolves();

                await request({
                    export: fakeExport,
                });
            });

            it('it responds with a 200', () => {
                expect(httpRes.status).to.have.been.calledWith(200);
            });

            it('it responds with a success = true', () => {
                expect(response.success).to.be.true;
            });
        });
    });

    describe('.getActivationLink()', () => {
        let userId;
        beforeEach(() => {
            userId = global.generate('number');
            httpReq = mockReq({
                params: {
                    id: userId,
                },
            });
            httpRes = mockRes();
        });

        describe('if the query fetching the user fails', () => {
            beforeEach(async () => {
                otherMockModels.user.findOne.withArgs(userId).rejects(global.generate('string'));

                await getActivationLink(httpReq, httpRes);
                [response] = httpRes.send.getCalls()[0].args;
            });

            it('it responds with a 500', () => {
                expect(httpRes.status).to.have.been.calledWith(500);
            });

            it('it responds with the proper error messages', () => {
                expect(response.error).to.be.eql({
                    user_message: 'Une erreur est survenue lors de la lecture de la base de données',
                    developer_message: 'Failed retrieving the user from database',
                });
            });
        });

        describe('if there is no user matching the given id', () => {
            beforeEach(async () => {
                otherMockModels.user.findOne.withArgs(userId).resolves(null);

                await getActivationLink(httpReq, httpRes);
                [response] = httpRes.send.getCalls()[0].args;
            });

            it('it responds with a 404', () => {
                expect(httpRes.status).to.have.been.calledWith(404);
            });

            it('it responds with the proper error messages', () => {
                expect(response.error).to.be.eql({
                    user_message: 'L\'utilisateur à activer n\'existe pas',
                    developer_message: 'The user to be activated does not exist',
                });
            });
        });

        describe('if the user exists', () => {
            describe('if deactivating the user fails', () => {
                let error;
                beforeEach(async () => {
                    error = global.generate('string');
                    otherMockModels.user.deactivate.withArgs(userId).rejects(error);

                    await getActivationLink(httpReq, httpRes);
                    [response] = httpRes.send.getCalls()[0].args;
                });

                it('it responds with a 500', () => {
                    expect(httpRes.status).to.have.been.calledWith(500);
                });

                it('it responds with the proper error messages', () => {
                    expect(response.error).to.be.eql({
                        user_message: 'Une erreur est survenue lors de la désactivation de l\'utilisateur',
                        developer_message: 'Failed updating the user in database',
                    });
                });
            });

            describe('if deactivating the user succeeds', () => {
                let userEmail;
                let activationLink;
                beforeEach(async () => {
                    userEmail = global.generate('string');
                    otherMockModels.user.findOne.withArgs(userId).resolves({
                        id: userId,
                        email: userEmail,
                        active: false,
                    });
                    otherMockModels.user.deactivate.withArgs(userId).resolves();

                    activationLink = global.generate('string');
                    mockAuth.getAccountActivationLink.withArgs({
                        id: userId,
                        email: userEmail,
                    }).returns(activationLink);

                    await getActivationLink(httpReq, httpRes);
                    [response] = httpRes.send.getCalls()[0].args;
                });

                it('it responds with a 200', () => {
                    expect(httpRes.status).to.have.been.calledWith(200);
                });

                it('it responds with an activation link', () => {
                    expect(response).to.be.eql({
                        activationLink,
                    });
                });
            });
        });
    });

    describe('.checkActivationToken()', () => {
        describe('if there is no token in the request', () => {
            beforeEach(async () => {
                httpReq = mockReq({});
                httpRes = mockRes();

                await checkActivationToken(httpReq, httpRes);
                [response] = httpRes.send.getCalls()[0].args;
            });

            it('it responds with a 400', () => {
                expect(httpRes.status).to.have.been.calledWith(400);
            });

            it('it responds with the proper error messages', () => {
                expect(response).to.be.eql({
                    error: {
                        user_message: 'Le jeton d\'activation est manquant',
                        developer_message: 'The activation token is missing',
                    },
                });
            });
        });

        describe('if the token is not valid', () => {
            beforeEach(async () => {
                httpReq = mockReq({
                    params: {
                        token: global.generate('string'),
                    },
                });
                httpRes = mockRes();

                await checkActivationToken(httpReq, httpRes);
                [response] = httpRes.send.getCalls()[0].args;
            });

            it('it responds with a 400', () => {
                expect(httpRes.status).to.have.been.calledWith(400);
            });

            it('it responds with the proper error messages', () => {
                expect(response).to.be.eql({
                    error: {
                        user_message: 'Le jeton d\'activation est invalide ou expiré',
                        developer_message: 'The activation token is either invalid or expired',
                    },
                });
            });
        });

        describe('if the token is valid but expired', () => {
            beforeEach(async () => {
                httpReq = mockReq({
                    params: {
                        token: jwt.sign({ what: 'ever' }, authConfig.secret, {
                            expiresIn: '1',
                        }),
                    },
                });
                httpRes = mockRes();

                await checkActivationToken(httpReq, httpRes);
                [response] = httpRes.send.getCalls()[0].args;
            });

            it('it responds with a 400', () => {
                expect(httpRes.status).to.have.been.calledWith(400);
            });

            it('it responds with the proper error messages', () => {
                expect(response).to.be.eql({
                    error: {
                        user_message: 'Le jeton d\'activation est invalide ou expiré',
                        developer_message: 'The activation token is either invalid or expired',
                    },
                });
            });
        });

        describe('if the token is fully valid', () => {
            let token;
            let userId;
            beforeEach(() => {
                userId = global.generate('number');
                token = {
                    userId,
                };
                httpReq = mockReq({
                    params: {
                        token: jwt.sign(token, authConfig.secret, {
                            expiresIn: '1s',
                        }),
                    },
                });
                httpRes = mockRes();
            });

            describe('if the user related to the token does not actually exist', () => {
                beforeEach(async () => {
                    otherMockModels.user.findOne.withArgs(userId).returns(null);

                    await checkActivationToken(httpReq, httpRes);
                    [response] = httpRes.send.getCalls()[0].args;
                });

                it('it responds with a 400', () => {
                    expect(httpRes.status).to.have.been.calledWith(400);
                });

                it('it responds with the proper error messages', () => {
                    expect(response).to.be.eql({
                        error: {
                            user_message: 'Le jeton d\'activation ne correspond à aucun utilisateur',
                            developer_message: 'The activation token does not match a real user',
                        },
                    });
                });
            });

            describe('if the user related to the token actually exists', () => {
                describe('if that user is already active', () => {
                    beforeEach(async () => {
                        const fakeUser = {
                            id: userId,
                            email: global.generate('string'),
                            active: true,
                        };
                        otherMockModels.user.findOne.withArgs(userId).returns(fakeUser);

                        await checkActivationToken(httpReq, httpRes, sinon.stub());
                        [response] = httpRes.send.getCalls()[0].args;
                    });

                    it('it responds with a 400', () => {
                        expect(httpRes.status).to.have.been.calledWith(400);
                    });

                    it('it responds with the proper error messages', () => {
                        expect(response).to.be.eql({
                            error: {
                                user_message: 'Ce compte utilisateur est déjà activé',
                                developer_message: 'The user is already activated',
                            },
                        });
                    });
                });

                describe('if that user is not active yet', () => {
                    let fakeUser;
                    beforeEach(async () => {
                        fakeUser = {
                            id: userId,
                            email: global.generate('string'),
                            active: false,
                        };

                        otherMockModels.user.findOne.withArgs(userId).returns(fakeUser);

                        await checkActivationToken(httpReq, httpRes, sinon.stub());
                        [response] = httpRes.send.getCalls()[0].args;
                    });

                    it('it responds with a 200', () => {
                        expect(httpRes.status).to.have.been.calledWith(200);
                    });

                    it('it responds with the user id', () => {
                        expect(response).to.be.eql({
                            userId: fakeUser.id,
                        });
                    });
                });
            });
        });
    });

    describe('.activate()', () => {
        let params;
        let body;
        describe('if there is no token in the request', () => {
            beforeEach(async () => {
                httpReq = mockReq({});
                httpRes = mockRes();

                await activate(httpReq, httpRes);
                [response] = httpRes.send.getCalls()[0].args;
            });

            it('it responds with a 400', () => {
                expect(httpRes.status).to.have.been.calledWith(400);
            });

            it('it responds with the proper error messages', () => {
                expect(response).to.be.eql({
                    error: {
                        user_message: 'Le jeton d\'activation est manquant',
                        developer_message: 'The activation token is missing',
                    },
                });
            });
        });

        describe('if the token is not valid', () => {
            beforeEach(async () => {
                httpReq = mockReq({
                    body: {
                        token: global.generate('string'),
                    },
                });
                httpRes = mockRes();

                await activate(httpReq, httpRes);
                [response] = httpRes.send.getCalls()[0].args;
            });

            it('it responds with a 400', () => {
                expect(httpRes.status).to.have.been.calledWith(400);
            });

            it('it responds with the proper error messages', () => {
                expect(response).to.be.eql({
                    error: {
                        user_message: 'Le jeton d\'activation est invalide ou expiré',
                        developer_message: 'The activation token is either invalid or expired',
                    },
                });
            });
        });

        describe('if the token is valid but expired', () => {
            beforeEach(async () => {
                httpReq = mockReq({
                    body: {
                        token: jwt.sign({ what: 'ever' }, authConfig.secret, {
                            expiresIn: '1',
                        }),
                    },
                });
                httpRes = mockRes();

                await activate(httpReq, httpRes);
                [response] = httpRes.send.getCalls()[0].args;
            });

            it('it responds with a 400', () => {
                expect(httpRes.status).to.have.been.calledWith(400);
            });

            it('it responds with the proper error messages', () => {
                expect(response).to.be.eql({
                    error: {
                        user_message: 'Le jeton d\'activation est invalide ou expiré',
                        developer_message: 'The activation token is either invalid or expired',
                    },
                });
            });
        });

        describe('if the token is fully valid', () => {
            let token;
            let userId;
            beforeEach(() => {
                userId = global.generate('number');
                token = {
                    userId,
                };
                body = {
                    token: jwt.sign(token, authConfig.secret, {
                        expiresIn: '1s',
                    }),
                };
                httpRes = mockRes();
            });

            describe('if the user related to the token does not actually exist', () => {
                beforeEach(async () => {
                    httpReq = mockReq({
                        body,
                    });
                    otherMockModels.user.findOne.withArgs(userId, true).returns(null);

                    await activate(httpReq, httpRes);
                    [response] = httpRes.send.getCalls()[0].args;
                });

                it('it responds with a 400', () => {
                    expect(httpRes.status).to.have.been.calledWith(400);
                });

                it('it responds with the proper error messages', () => {
                    expect(response).to.be.eql({
                        error: {
                            user_message: 'Le jeton d\'activation ne correspond à aucun utilisateur',
                            developer_message: 'The activation token does not match a real user',
                        },
                    });
                });
            });

            describe('if the user related to the token actually exists', () => {
                let fakeUser;
                beforeEach(async () => {
                    fakeUser = {
                        id: userId,
                        email: global.generate('string'),
                        active: true,
                        salt: global.generate('string'),
                    };

                    params = {
                        id: `${userId}`,
                    };
                });

                describe('if the user id in the request does not match the token\'s owner', () => {
                    beforeEach(async () => {
                        params.id = global.generate('number');

                        httpReq = mockReq({
                            params,
                            body,
                        });

                        otherMockModels.user.findOne.withArgs(userId, true).returns(fakeUser);

                        await activate(httpReq, httpRes, sinon.stub());
                        [response] = httpRes.send.getCalls()[0].args;
                    });

                    it('it responds with a 400', () => {
                        expect(httpRes.status).to.have.been.calledWith(400);
                    });

                    it('it responds with the proper error messages', () => {
                        expect(response).to.be.eql({
                            error: {
                                user_message: 'Le jeton d\'activation n\'est pas valide',
                                developer_message: 'The activation token does not match the user id',
                            },
                        });
                    });
                });

                describe('if that user is already active', () => {
                    beforeEach(async () => {
                        httpReq = mockReq({
                            params,
                            body,
                        });

                        otherMockModels.user.findOne.withArgs(userId, true).returns(fakeUser);

                        await activate(httpReq, httpRes, sinon.stub());
                        [response] = httpRes.send.getCalls()[0].args;
                    });

                    it('it responds with a 400', () => {
                        expect(httpRes.status).to.have.been.calledWith(400);
                    });

                    it('it responds with the proper error messages', () => {
                        expect(response).to.be.eql({
                            error: {
                                user_message: 'Ce compte utilisateur est déjà activé',
                                developer_message: 'The user is already activated',
                            },
                        });
                    });
                });

                describe('if that user is not active yet', () => {
                    beforeEach(() => {
                        fakeUser.active = false;
                        otherMockModels.user.findOne.withArgs(userId, true).returns(fakeUser);
                    });

                    describe('if the password is missing', () => {
                        beforeEach(async () => {
                            httpReq = mockReq({
                                params,
                                body,
                            });

                            await activate(httpReq, httpRes, sinon.stub());
                            [response] = httpRes.send.getCalls()[0].args;
                        });

                        it('it responds with a 400', () => {
                            expect(httpRes.status).to.have.been.calledWith(400);
                        });

                        it('it responds with the proper error messages', () => {
                            expect(response).to.be.eql({
                                error: {
                                    user_message: 'Le mot de passe est obligatoire',
                                    developer_message: 'Input data is invalid',
                                },
                            });
                        });
                    });

                    describe('if the password is empty', () => {
                        beforeEach(async () => {
                            body.password = '';

                            httpReq = mockReq({
                                params,
                                body,
                            });

                            await activate(httpReq, httpRes, sinon.stub());
                            [response] = httpRes.send.getCalls()[0].args;
                        });

                        it('it responds with a 400', () => {
                            expect(httpRes.status).to.have.been.calledWith(400);
                        });

                        it('it responds with the proper error messages', () => {
                            expect(response).to.be.eql({
                                error: {
                                    user_message: 'Le mot de passe est obligatoire',
                                    developer_message: 'Input data is invalid',
                                },
                            });
                        });
                    });

                    describe('if the password is valid', () => {
                        let hashedPassword;
                        beforeEach(async () => {
                            body.password = global.generate('string');
                            hashedPassword = global.generate('string');
                            mockAuth.hashPassword.withArgs(body.password, fakeUser.salt).returns(hashedPassword);
                        });

                        describe('if the update query fails', () => {
                            beforeEach(async () => {
                                httpReq = mockReq({
                                    params,
                                    body,
                                });

                                otherMockModels.user.update.withArgs(userId, {
                                    password: hashedPassword,
                                    active: true,
                                }).rejects();

                                await activate(httpReq, httpRes, sinon.stub());
                                [response] = httpRes.send.getCalls()[0].args;
                            });

                            it('it responds with a 500', () => {
                                expect(httpRes.status).to.have.been.calledWith(500);
                            });

                            it('it responds with the proper error messages', () => {
                                expect(response).to.be.eql({
                                    error: {
                                        user_message: 'Une erreur est survenue lors de l\'écriture en base de données',
                                        developer_message: 'Failed updating the user',
                                    },
                                });
                            });
                        });

                        describe('if the update query succeeds', () => {
                            beforeEach(async () => {
                                httpReq = mockReq({
                                    params,
                                    body,
                                });

                                otherMockModels.user.update.withArgs(userId, {
                                    password: hashedPassword,
                                    active: true,
                                }).resolves();

                                await activate(httpReq, httpRes, sinon.stub());
                                [response] = httpRes.send.getCalls()[0].args;
                            });

                            it('it responds with a 200', () => {
                                expect(httpRes.status).to.have.been.calledWith(200);
                            });

                            it('it responds with an empty object', () => {
                                expect(response).to.be.eql({});
                            });
                        });
                    });
                });
            });
        });
    });
});
