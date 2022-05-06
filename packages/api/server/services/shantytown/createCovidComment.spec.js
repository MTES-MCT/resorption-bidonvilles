const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const { expect } = chai;
chai.use(sinonChai);


const shantytownModel = require('#server/models/shantytownModel');
const ServiceError = require('#server/errors/ServiceError');
const createCovidCommentService = require('./createCovidComment');

describe.only('services/shantytown', () => {
    const metadata = {
        date: {
            label: 'La date',
            badFormat: global.generate().not('stringdate'),
        },
        action_mediation_sante: {
            label: 'Le champ "Action de médiation en santé"',
            badFormat: global.generate().not('boolean'),
        },
        sensibilisation_vaccination: {
            label: 'Le champ "Sensibilisation à la vaccination"',
            badFormat: global.generate().not('boolean'),
        },
        equipe_mobile_depistage: {
            label: 'Le champ "Équipe mobile de dépistage"',
            badFormat: global.generate().not('boolean'),
        },
        equipe_mobile_vaccination: {
            label: 'Le champ "Équipe mobile de vaccination"',
            badFormat: global.generate().not('boolean'),
        },
        personnes_orientees: {
            label: 'Le champ "Personne(s) orientée(s) vers un centre d\'hébergement spécialisé (desserrement)"',
            badFormat: global.generate().not('boolean'),
        },
        personnes_avec_symptomes: {
            label: 'Le champ "Personnes avec des symptômes Covid-19"',
            badFormat: global.generate().not('boolean'),
        },
        besoin_action: {
            label: 'Le champ "Besoin d\'une action prioritaire"',
            badFormat: global.generate().not('boolean'),
        },
        description: {
            label: 'Le commentaire',
            badFormat: global.generate().not(['string', 'stringdate']),
        },
    };

    describe('createCovidComment()', () => {
        let stubs;
        let data;
        beforeEach(() => {
            data = {
                user: {
                    id: 42,
                },
                params: {
                    id: 42,
                },
                body: {
                    date: (new Date(2000, 0, 1)).toString(),
                    action_mediation_sante: true,
                    sensibilisation_vaccination: true,
                    equipe_mobile_depistage: true,
                    equipe_mobile_vaccination: true,
                    personnes_orientees: true,
                    personnes_avec_symptomes: true,
                    besoin_action: true,
                    description: 'lorem ipsum',
                },
            };

            stubs = {
                findOne: sinon.stub(shantytownModel, 'findOne'),
                createCovidComment: sinon.stub(shantytownModel, 'createCovidComment'),
                getComments: sinon.stub(shantytownModel, 'getComments'),
            };

            stubs.findOne.withArgs(data.user, data.params.id).resolves({
                builtAt: (new Date(1999, 0, 1)).getTime() / 1000,
            });
        });
        afterEach(() => {
            sinon.restore();
        });
        describe('récupération du site', () => {
            it('si le site n\'existe pas en base de données, renvoie une exception ServiceError \'shantytown_unfound\'', async () => {
                stubs.findOne.withArgs(data.user, data.params.id).resolves(null);
                let responseError;
                try {
                    await createCovidCommentService(data.user, data.params.id, data.body);
                } catch (error) {
                    responseError = error;
                }

                // eslint-disable-next-line no-unused-expressions
                expect(stubs.createCovidComment).to.not.have.been.called;
                expect(responseError).to.be.instanceOf(ServiceError);
                expect(responseError.code).to.be.eql('shantytown_unfound');
            });
            it('si le modèle échoue, renvoie une exception ServiceError \'fetch_failed\'', async () => {
                stubs.findOne.withArgs(data.user, data.params.id).rejects(new Error());
                let responseError;
                try {
                    await createCovidCommentService(data.user, data.params.id, data.body);
                } catch (error) {
                    responseError = error;
                }

                // eslint-disable-next-line no-unused-expressions
                expect(stubs.createCovidComment).to.not.have.been.called;
                expect(responseError).to.be.instanceOf(ServiceError);
                expect(responseError.code).to.be.eql('fetch_failed');
            });
        });

        describe('création du commentaire', () => {
            it('sanitize la description', async () => {
                data.body.description = `  
                   lorem ipsum     `;


                await createCovidCommentService(data.user, data.params.id, data.body);

                expect(stubs.createCovidComment).to.have.been.calledOnceWith(
                    data.user,
                    data.params.id,
                    Object.assign({}, data.body, {
                        date: new Date(data.body.date),
                        description: 'lorem ipsum',
                    }),
                );
            });

            it('crée le commentaire en bdd', async () => {
                await createCovidCommentService(data.user, data.params.id, data.body);

                // assert
                expect(stubs.createCovidComment).to.have.been.calledOnceWith(
                    data.user,
                    data.params.id,
                    Object.assign({}, data.body, { date: new Date(data.body.date) }),
                );
            });
            it('si le modèle échoue à créer le commentaire, renvoie une exception ServiceError \'write_failed\'', async () => {
                stubs.createCovidComment.rejects(new Error());
                let responseError;
                try {
                    await createCovidCommentService(data.user, data.params.id, data.body);
                } catch (error) {
                    responseError = error;
                }

                // eslint-disable-next-line no-unused-expressions
                expect(responseError).to.be.instanceOf(ServiceError);
                expect(responseError.code).to.be.eql('write_failed');
            });
            it('retourne la liste des commentaires à jour', async () => {
                // setup

                const comments = [{}, {}, {}];
                stubs.getComments
                    .withArgs(data.user, [data.params.id], true)
                    .resolves({
                        [data.params.id]: comments,
                    });

                // execute
                const resultat = await createCovidCommentService(data.user, data.params.id, data.body);

                // assert
                expect(stubs.getComments).to.have.been.calledAfter(
                    stubs.createCovidComment,
                );
                expect(resultat).to.be.eql(comments);
            });
        });


        Object.keys(metadata).forEach((name) => {
            describe(`if argument "${name}" is missing`, () => {
                let responseError;
                beforeEach(async () => {
                    // setup
                    delete data.body[name];

                    // execute
                    try {
                        await createCovidCommentService(data.user, data.params.id, data.body);
                    } catch (error) {
                        responseError = error;
                    }
                });

                it('renvoie une exception Service Error \'data_incomplete\'', () => {
                    expect(responseError).to.be.instanceOf(ServiceError);
                    expect(responseError.code).to.be.eql('data_incomplete');
                });
            });

            describe(`if argument "${name}" is not of good type`, () => {
                let responseError;
                beforeEach(async () => {
                    // setup
                    data.body[name] = metadata[name].badFormat;

                    // execute
                    try {
                        await createCovidCommentService(data.user, data.params.id, data.body);
                    } catch (error) {
                        responseError = error;
                    }
                });

                it('renvoie une exception Service Error \'data_incomplete\'', () => {
                    expect(responseError).to.be.instanceOf(ServiceError);
                    expect(responseError.code).to.be.eql('data_incomplete');
                });
            });
        });
    });
});
