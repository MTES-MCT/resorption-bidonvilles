const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const { expect } = chai;
chai.use(sinonChai);

const proxyquire = require('proxyquire');
const ServiceError = require('#server/errors/ServiceError');

const permissionUtils = require('#server/utils/permission');
const geoModel = require('#server/models/geoModel');
const geoUtils = require('#server/utils/geo');
const shantytownModel = require('#server/models/shantytownModel');
const closingSolutionModel = require('#server/models/closingSolutionModel');
const excelUtils = require('#server/utils/excel');
const statsExportsModel = require('#server/models/statsExports');

let exportTownService;


describe.only('services/shantytown', () => {
    describe('exportTown()', () => {
        let stubs;
        let createExportSectionsStub;
        let serializeExportPropertiesStub;
        const user = { id: 0 };
        const data = {
            locationType: 'city',
            locationCode: 0,
            closedTowns: '0',
        };
        const location = {
            type: 'region', region: { code: 0 }, departement: null, epci: null, city: null,
        };
        beforeEach(() => {
            createExportSectionsStub = sinon.stub();
            serializeExportPropertiesStub = sinon.stub();
            exportTownService = proxyquire('./exportTown', {
                './_common/createExportSections': createExportSectionsStub,
                './_common/serializeExportProperties': serializeExportPropertiesStub,
            });
            stubs = {
                can: sinon.stub(permissionUtils, 'can'),
                do: sinon.stub(),
                on: sinon.stub(),
                getLocation: sinon.stub(geoModel, 'getLocation'),
                fromGeoLevelToTableName: sinon.stub(geoUtils, 'fromGeoLevelToTableName'),
                shantytownModelFindAll: sinon.stub(shantytownModel, 'findAll'),
                closingSolutionModelFindAll: sinon.stub(closingSolutionModel, 'findAll'),
                createExport: sinon.stub(excelUtils, 'createExport'),
                create: sinon.stub(statsExportsModel, 'create'),
            };
            stubs.can.returns({
                do: stubs.do,
            });
            stubs.do.returns({
                on: stubs.on,
            });
            stubs.getLocation.resolves(location);
            stubs.shantytownModelFindAll.resolves([{ id: 0 }]);
            stubs.closingSolutionModelFindAll.resolves([]);
            stubs.createExport.resolves({});
            stubs.on.returns(true);
            stubs.fromGeoLevelToTableName.returns('region');
        });

        afterEach(() => {
            sinon.restore();
        });
        describe('traite les données géographiques', () => {
            it('renvoie une exception ServiceError \'data_incomplete\' si les données du périmètre géographique sont incomplètes', async () => {
                let responseError;
                try {
                    await exportTownService(user, {});
                } catch (error) {
                    responseError = error;
                }
                expect(responseError).to.be.instanceOf(ServiceError);
                expect(responseError.code).to.be.eql('data_incomplete');
            });
            it('récupère la localisation complète à partir de Location Type et LocationCode', async () => {
                try {
                    await exportTownService(user, data);
                } catch (error) {
                    // ignore
                }
                expect(stubs.getLocation).to.have.been.calledOnceWith(data.locationType, data.locationCode);
            });
            it('renvoie une exception ServiceError \'fetch_failed\' si le modèle échoue à récupérer la localisation', async () => {
                stubs.getLocation.rejects(new Error());
                let responseError;
                try {
                    await exportTownService(user, data);
                } catch (error) {
                    responseError = error;
                }
                expect(responseError).to.be.instanceOf(ServiceError);
                expect(responseError.code).to.be.eql('fetch_failed');
                expect(responseError.nativeError.developer_message).to.be.eql('could not get location');
            });
        });
        describe('traite les permissions', () => {
            it('vérifie que l\'utilisateur a le droit d\'exporter les sites sur la localisation', async () => {
                try {
                    await exportTownService(user, data);
                } catch (error) {
                    // ignore
                }
                expect(stubs.can).to.have.been.calledOnceWith(user);
                expect(stubs.do).to.have.been.calledOnceWith('export', 'shantytown');
                expect(stubs.on).to.have.been.calledOnceWith(location);
            });
            it('renvoie une exception ServiceError \'permission_denied\' si l\'utilisateur n\'a pas la permission', async () => {
                stubs.on.returns(false);
                let responseError;
                try {
                    await exportTownService(user, data);
                } catch (error) {
                    responseError = error;
                }
                expect(responseError).to.be.instanceOf(ServiceError);
                expect(responseError.code).to.be.eql('permission_denied');
                expect(responseError.nativeError.developer_message).to.be.eql('the requested location is not allowed to current user');
            });
        });
        describe('récupère les sites et closingSolutions', () => {
            describe('récupère la liste des sites en prenant en compte la localisation et le statut des sites demandé (ouvert ou fermé)', () => {
                it('récupère la liste des sites ouverts', async () => {
                    data.closedTowns = '0';
                    try {
                        await exportTownService(user, data);
                    } catch (error) {
                        // ignore
                    }
                    expect(stubs.shantytownModelFindAll).to.have.been.calledOnceWith(
                        user,
                        [{ status: { not: false, value: 'open' } }, { location: { query: 'region.code', value: 0 } }],
                        'export',
                    );
                });
                it('récupère la liste des sites fermés', async () => {
                    data.closedTowns = '1';
                    try {
                        await exportTownService(user, data);
                    } catch (error) {
                        // ignore
                    }
                    expect(stubs.shantytownModelFindAll).to.have.been.calledOnceWith(
                        user,
                        [{ status: { not: true, value: 'open' } }, { location: { query: 'region.code', value: 0 } }],
                        'export',
                    );
                });
            });

            it('renvoie une exception ServiceError \'fetch_failed\' si le modèle échoue à récupérer la liste des sites', async () => {
                stubs.shantytownModelFindAll.rejects(new Error());
                let responseError;
                try {
                    await exportTownService(user, data);
                } catch (error) {
                    responseError = error;
                }
                expect(responseError).to.be.instanceOf(ServiceError);
                expect(responseError.code).to.be.eql('fetch_failed');
                expect(responseError.nativeError.developer_message).to.be.eql('Failed to fetch towns');
            });
            it('renvoie une exception ServiceError \'fetch_failed\' si la liste des sites est vide', async () => {
                stubs.shantytownModelFindAll.resolves([]);
                let responseError;
                try {
                    await exportTownService(user, data);
                } catch (error) {
                    responseError = error;
                }
                expect(responseError).to.be.instanceOf(ServiceError);
                expect(responseError.code).to.be.eql('fetch_failed');
                expect(responseError.nativeError.developer_message).to.be.eql('no shantytown to be exported');
            });
            it('récupère les closingSolutions', async () => {
                try {
                    await exportTownService(user, data);
                } catch (error) {
                    // ignore
                }
                // eslint-disable-next-line no-unused-expressions
                expect(stubs.closingSolutionModelFindAll).to.have.been.calledOnce;
            });
            it('renvoie une exception ServiceError \'fetch_failed\' si le modèle échoue à récupérer les closingSolutions', async () => {
                stubs.closingSolutionModelFindAll.rejects(new Error());
                let responseError;
                try {
                    await exportTownService(user, data);
                } catch (error) {
                    responseError = error;
                }
                expect(responseError).to.be.instanceOf(ServiceError);
                expect(responseError.code).to.be.eql('fetch_failed');
                expect(responseError.nativeError.developer_message).to.be.eql('Failed to fetch closing solutions');
            });
        });
        describe('gère l\'export des données', () => {
            it('serialise les propriétés de l\'export et crée les différentes sections', async () => {
                try {
                    await exportTownService(user, data);
                } catch (error) {
                    // ignore
                }
                // eslint-disable-next-line no-unused-expressions
                expect(createExportSectionsStub).to.have.been.calledOnce;
                // eslint-disable-next-line no-unused-expressions
                expect(serializeExportPropertiesStub).to.have.been.calledOnce;
            });
            it('crée l\'export final et le renvoie', async () => {
                let response;
                try {
                    response = await exportTownService(user, data);
                } catch (error) {
                    // ignore
                }
                // eslint-disable-next-line no-unused-expressions
                expect(stubs.createExport).to.have.been.calledOnce;
                expect(response).to.be.an('object');
            });
            it('ajoute l\'export aux stats', async () => {
                try {
                    await exportTownService(user, data);
                } catch (error) {
                    // ignore
                }
                // eslint-disable-next-line no-unused-expressions
                expect(stubs.create).to.have.been.calledOnce;
            });
            it('renvoie une exception Service Error \'write_failed\' si le modèle échoue à ajouter les stats', async () => {
                stubs.create.rejects(new Error());
                let responseError;
                try {
                    await exportTownService(user, data);
                } catch (error) {
                    responseError = error;
                }
                // eslint-disable-next-line no-unused-expressions
                expect(stubs.create).to.have.been.calledOnce;
                expect(responseError).to.be.instanceOf(ServiceError);
                expect(responseError.code).to.be.eql('write_failed');
                expect(responseError.nativeError.developer_message).to.be.eql('Failed to store statistics');
            });
        });
    });
});
