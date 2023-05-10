import { DataReportRawData } from '#server/models/dataReportModel/getRawData';
import { rewiremock } from '#test/rewiremock';
import { expect } from 'chai';
import sinon from 'sinon';
import { row as fakeData } from '#test/utils/dataReportRawData';
import ServiceError from '#server/errors/ServiceError';
import { fail } from 'assert';
import { TownReport } from './types/TownReport';

const sandbox = sinon.createSandbox();
const dataReportModel = {
    getRawData: sandbox.stub(),
};

rewiremock('#server/models/dataReportModel').withDefault(dataReportModel);
rewiremock.passBy(/initializeTownsReport/);
rewiremock.passBy(/getReportIndex/);

describe('dataReportService.getTownsReport()', () => {
    let getTownsReport;
    beforeEach(async () => {
        rewiremock.enable();
        ({ default: getTownsReport } = await rewiremock.module(() => import('./getTownsReport')));
    });
    afterEach(() => {
        rewiremock.disable();
        sandbox.reset();
    });

    it('retourne les données pour chaque date entre les deux fournies en paramètre', async () => {
        dataReportModel.getRawData.resolves([]);

        const from = new Date(2022, 11, 12);
        const to = new Date(2023, 2, 24);
        const response = await getTownsReport(from, to);

        expect(response).to.have.lengthOf(4);
        expect(response.map(({ date }) => date)).to.be.deep.equal([
            from,
            new Date(2023, 0, 1),
            new Date(2023, 1, 1),
            to,
        ]);
    });

    it('retourne les données uniquement pour la date `from` si `from` et `to` sont identiques', async () => {
        dataReportModel.getRawData.resolves([]);

        const from = new Date(2023, 11, 12);
        const to = new Date(2023, 11, 12);
        const response = await getTownsReport(from, to);

        expect(response).to.have.lengthOf(1);
    });

    it('retourne les données pour `from` et `to` si elles sont du même mois mais pas du même jour', async () => {
        dataReportModel.getRawData.resolves([]);

        const from = new Date(2023, 11, 12);
        const to = new Date(2023, 11, 13);
        const response = await getTownsReport(from, to);
        expect(response).to.have.lengthOf(2);
    });

    it('retourne un tableau vide si les dates sont incohérentes', async () => {
        dataReportModel.getRawData.resolves([]);

        expect(await getTownsReport(new Date('2023-03-24'), new Date('2022-12-12'))).to.be.eql([]);
    });

    it('un site est correctement décompté dans le total des sites', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 0, 31);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                input_date: new Date(2023, 0, 15),
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect(response[0].all.all.number_of_towns.total).to.be.equal(0);
        expect(response[1].all.all.number_of_towns.total).to.be.equal(1);
    });

    it('un site est correctement décompté dans le total des sites même si son dernier état connu précède `from`', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 0, 1);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                input_date: new Date(2022, 0, 15),
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect(response[0].all.all.number_of_towns.total).to.be.equal(1);
    });

    it('un site est correctement décompté dans le total des sites à chaque mois', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 2, 1);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                input_date: new Date(2022, 0, 15),
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect([
            response[0].all.all.number_of_towns.total,
            response[1].all.all.number_of_towns.total,
            response[2].all.all.number_of_towns.total,
        ]).to.be.deep.equal([1, 1, 1]);
    });

    it('un site n\'est plus décompté après sa fermeture', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 2, 1);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                input_date: new Date(2022, 0, 15),
                closed_at: new Date(2023, 1, 15),
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect([
            response[0].all.all.number_of_towns.total,
            response[1].all.all.number_of_towns.total,
            response[2].all.all.number_of_towns.total,
        ]).to.be.deep.equal([1, 1, 0]);
    });

    it('un site avec plusieurs saisies n\'est compté qu\'une seule fois', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 0, 31);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                input_date: new Date(2022, 0, 16),
            }),
            fakeData({
                shantytown_id: 1,
                input_date: new Date(2022, 0, 15),
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect(response[0].all.all.number_of_towns.total).to.be.eql(1);
    });

    it('quand la période demandée s\'étale sur plusieurs mois, une saisie à la date `to` est prise en compte', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 3, 30);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                input_date: new Date(2023, 3, 30),
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect(response[0].all.all.number_of_towns.total).to.be.eql(0);
        expect(response[3].all.all.number_of_towns.total).to.be.eql(1);
    });

    it('quand la période demandée s\'étale sur un seul mois, une saisie à la date `to` est prise en compte', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 0, 31);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                input_date: new Date(2023, 0, 31),
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect(response[0].all.all.number_of_towns.total).to.be.eql(0);
        expect(response[1].all.all.number_of_towns.total).to.be.eql(1);
    });

    it('les sites de 10 personnes ou plus sont bien décomptés séparément', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 0, 31);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                input_date: new Date(2022, 0, 15),
                population_total: 10,
            }),
            fakeData({
                shantytown_id: 2,
                input_date: new Date(2022, 0, 15),
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect(response[0].all.all.number_of_towns.total).to.be.eql(2);
        expect(response[0].big_towns_only.all.number_of_towns.total).to.be.eql(1);
    });

    it('les sites outremers sont bien décomptés séparément', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 0, 31);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                input_date: new Date(2022, 0, 15),
                is_oversea: true,
            }),
            fakeData({
                shantytown_id: 2,
                input_date: new Date(2022, 0, 15),
                is_oversea: true,
                population_total: 10,
            }),
            fakeData({
                shantytown_id: 3,
                input_date: new Date(2022, 0, 15),
            }),
            fakeData({
                shantytown_id: 4,
                input_date: new Date(2022, 0, 15),
                population_total: 10,
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect(response[0].all.all.number_of_towns.total).to.be.eql(4);
        expect(response[0].all.overseas.number_of_towns.total).to.be.eql(2);
        expect(response[0].big_towns_only.all.number_of_towns.total).to.be.eql(2);
        expect(response[0].big_towns_only.overseas.number_of_towns.total).to.be.eql(1);
    });

    it('les sites avec différentes origines sont bien décomptées séparément', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 0, 1);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                input_date: new Date(2022, 0, 15),
                origins: 'european',
            }),
            fakeData({
                shantytown_id: 2,
                input_date: new Date(2022, 0, 15),
                origins: 'french',
            }),
            fakeData({
                shantytown_id: 3,
                input_date: new Date(2022, 0, 15),
                origins: 'other',
            }),
            fakeData({
                shantytown_id: 4,
                input_date: new Date(2022, 0, 15),
                origins: 'mixed',
            }),
            fakeData({
                shantytown_id: 5,
                input_date: new Date(2022, 0, 15),
                origins: null,
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect(response[0].all.all.number_of_towns.total).to.be.eql(5);
        expect(response[0].all.all.number_of_towns.eu_only).to.be.eql(1);
        expect(response[0].all.all.number_of_towns.french_only).to.be.eql(1);
        expect(response[0].all.all.number_of_towns.extra_eu_only).to.be.eql(1);
        expect(response[0].all.all.number_of_towns.mixed_origins).to.be.eql(1);
        expect(response[0].all.all.number_of_towns.unknown_origins).to.be.eql(1);
    });

    it('les différentes origines sont bien décomptées pour les sites `big_towns_only` aussi', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 0, 31);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                input_date: new Date(2022, 0, 15),
                origins: 'french',
                population_total: 10,
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect(response[0].big_towns_only.all.number_of_towns.french_only).to.be.eql(1);
    });

    it('le nombre total de personnes est bien décompté', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 0, 31);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                input_date: new Date(2022, 0, 15),
                population_total: 5,
            }),
            fakeData({
                shantytown_id: 2,
                input_date: new Date(2022, 0, 15),
                population_total: 10,
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect(response[0].all.all.number_of_people.total).to.be.eql(15);
        expect(response[0].big_towns_only.all.number_of_people.total).to.be.eql(10);
    });

    it('les sites avec nombre de personnes inconnu comptent pour 0 personnes', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 0, 31);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                input_date: new Date(2022, 0, 15),
                population_total: null,
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect(response[0].all.all.number_of_people.total).to.be.eql(0);
    });

    it('si un site a deux saisies au mois N et M, le nombre de personnes de ce site au mois N compte pour tous les mois jusqu\'à M - 1', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 3, 30);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                input_date: new Date(2023, 3, 30),
                population_total: 30,
            }),
            fakeData({
                shantytown_id: 1,
                input_date: new Date(2023, 3, 15),
                population_total: 15,
            }),
            fakeData({
                shantytown_id: 1,
                input_date: new Date(2023, 2, 1),
                population_total: null,
            }),
            fakeData({
                shantytown_id: 1,
                input_date: new Date(2022, 0, 1),
                population_total: 10,
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect(response[0].all.all.number_of_people.total).to.be.eql(10);
        expect(response[1].all.all.number_of_people.total).to.be.eql(10);
        expect(response[2].all.all.number_of_people.total).to.be.eql(0);
        expect(response[3].all.all.number_of_people.total).to.be.eql(30);
    });

    it('le nombre de personnes en outremer est bien décompté', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 0, 1);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                input_date: new Date(2023, 0, 1),
                population_total: 10,
                is_oversea: true,
            }),
            fakeData({
                shantytown_id: 2,
                input_date: new Date(2023, 0, 1),
                population_total: 5,
                is_oversea: true,
            }),
            fakeData({
                shantytown_id: 3,
                input_date: new Date(2023, 0, 1),
                population_total: 10,
                is_oversea: false,
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect(response[0].all.all.number_of_people.total).to.be.eql(25);
        expect(response[0].all.overseas.number_of_people.total).to.be.eql(15);
        expect(response[0].big_towns_only.overseas.number_of_people.total).to.be.eql(10);
    });

    it('le nombre de personnes par origines est bien décompté', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 0, 1);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                input_date: new Date(2023, 0, 1),
                population_total: 5,
                origins: 'european',
            }),
            fakeData({
                shantytown_id: 2,
                input_date: new Date(2023, 0, 1),
                population_total: 5,
                origins: 'french',
            }),
            fakeData({
                shantytown_id: 3,
                input_date: new Date(2023, 0, 1),
                population_total: 5,
                origins: 'other',
            }),
            fakeData({
                shantytown_id: 4,
                input_date: new Date(2023, 0, 1),
                population_total: 5,
                origins: 'mixed',
            }),
            fakeData({
                shantytown_id: 5,
                input_date: new Date(2023, 0, 1),
                population_total: 5,
                origins: null,
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect(response[0].all.all.number_of_people.origins_european).to.be.eql(5);
        expect(response[0].all.all.number_of_people.origins_french).to.be.eql(5);
        expect(response[0].all.all.number_of_people.origins_other).to.be.eql(5);
        expect(response[0].all.all.number_of_people.origins_mixed).to.be.eql(5);
        expect(response[0].all.all.number_of_people.origins_null).to.be.eql(5);
    });

    it('le nombre de personnes par origines est bien décompté pour les sites `big_towns` aussi', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 0, 1);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                input_date: new Date(2023, 0, 1),
                population_total: 10,
                origins: 'european',
            }),
            fakeData({
                shantytown_id: 2,
                input_date: new Date(2023, 0, 1),
                population_total: 10,
                origins: 'french',
            }),
            fakeData({
                shantytown_id: 3,
                input_date: new Date(2023, 0, 1),
                population_total: 10,
                origins: 'other',
            }),
            fakeData({
                shantytown_id: 4,
                input_date: new Date(2023, 0, 1),
                population_total: 10,
                origins: 'mixed',
            }),
            fakeData({
                shantytown_id: 5,
                input_date: new Date(2023, 0, 1),
                population_total: 10,
                origins: null,
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect(response[0].big_towns_only.all.number_of_people.origins_european).to.be.eql(10);
        expect(response[0].big_towns_only.all.number_of_people.origins_french).to.be.eql(10);
        expect(response[0].big_towns_only.all.number_of_people.origins_other).to.be.eql(10);
        expect(response[0].big_towns_only.all.number_of_people.origins_mixed).to.be.eql(10);
        expect(response[0].big_towns_only.all.number_of_people.origins_null).to.be.eql(10);
    });

    it('le nombre de mineurs est bien décompté', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 0, 1);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                input_date: new Date(2023, 0, 1),
                origins: 'french',
                population_total: 5,
                population_minors: 1,
            }),
            fakeData({
                shantytown_id: 2,
                input_date: new Date(2023, 0, 1),
                origins: 'european',
                population_total: 5,
                population_minors: 2,
            }),
            fakeData({
                shantytown_id: 3,
                input_date: new Date(2023, 0, 1),
                origins: 'other',
                population_total: 5,
                population_minors: 3,
            }),
            fakeData({
                shantytown_id: 4,
                input_date: new Date(2023, 0, 1),
                origins: 'mixed',
                population_total: 5,
                population_minors: 4,
            }),
            fakeData({
                shantytown_id: 5,
                input_date: new Date(2023, 0, 1),
                origins: null,
                population_total: 5,
                population_minors: 5,
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect(response[0].all.all.number_of_people.origins_french_minors).to.be.eql(1);
        expect(response[0].all.all.number_of_people.origins_european_minors).to.be.eql(2);
        expect(response[0].all.all.number_of_people.origins_other_minors).to.be.eql(3);
        expect(response[0].all.all.number_of_people.origins_mixed_minors).to.be.eql(4);
        expect(response[0].all.all.number_of_people.origins_null_minors).to.be.eql(5);
    });

    it('le nombre de mineurs est bien décompté pour les `big_towns` aussi', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 0, 1);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                input_date: new Date(2023, 0, 1),
                origins: 'french',
                population_total: 10,
                population_minors: 1,
            }),
            fakeData({
                shantytown_id: 2,
                input_date: new Date(2023, 0, 1),
                origins: 'european',
                population_total: 10,
                population_minors: 2,
            }),
            fakeData({
                shantytown_id: 3,
                input_date: new Date(2023, 0, 1),
                origins: 'other',
                population_total: 10,
                population_minors: 3,
            }),
            fakeData({
                shantytown_id: 4,
                input_date: new Date(2023, 0, 1),
                origins: 'mixed',
                population_total: 10,
                population_minors: 4,
            }),
            fakeData({
                shantytown_id: 5,
                input_date: new Date(2023, 0, 1),
                origins: null,
                population_total: 10,
                population_minors: 5,
            }),
            fakeData({
                shantytown_id: 6,
                input_date: new Date(2023, 0, 1),
                origins: null,
                population_total: 5,
                population_minors: 5,
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect(response[0].big_towns_only.all.number_of_people.origins_french_minors).to.be.eql(1);
        expect(response[0].big_towns_only.all.number_of_people.origins_european_minors).to.be.eql(2);
        expect(response[0].big_towns_only.all.number_of_people.origins_other_minors).to.be.eql(3);
        expect(response[0].big_towns_only.all.number_of_people.origins_mixed_minors).to.be.eql(4);
        expect(response[0].big_towns_only.all.number_of_people.origins_null_minors).to.be.eql(5);
    });

    it('retourne les totaux pour les sites entre 10 et 50 habitants', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 0, 1);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                input_date: new Date(2023, 0, 1),
                population_total: 9,
            }),
            fakeData({
                shantytown_id: 2,
                input_date: new Date(2023, 0, 1),
                population_total: 10,
                origins: 'other',
            }),
            fakeData({
                shantytown_id: 3,
                input_date: new Date(2023, 0, 1),
                population_total: 50,
                origins: 'european',
            }),
            fakeData({
                shantytown_id: 4,
                input_date: new Date(2023, 0, 1),
                population_total: 51,
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect(response[0].population_10_50.all).to.be.eql(60);
        expect(response[0].population_10_50.european).to.be.eql(50);
        expect(response[0].population_10_50.all_ids).to.be.deep.equal([2, 3]);
    });

    it('retourne les totaux pour les sites entre 51 et 100 habitants', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 0, 1);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                input_date: new Date(2023, 0, 1),
                population_total: 50,
            }),
            fakeData({
                shantytown_id: 2,
                input_date: new Date(2023, 0, 1),
                population_total: 51,
                origins: 'other',
            }),
            fakeData({
                shantytown_id: 3,
                input_date: new Date(2023, 0, 1),
                population_total: 100,
                origins: 'european',
            }),
            fakeData({
                shantytown_id: 4,
                input_date: new Date(2023, 0, 1),
                population_total: 101,
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect(response[0].population_51_100.all).to.be.eql(151);
        expect(response[0].population_51_100.european).to.be.eql(100);
        expect(response[0].population_51_100.all_ids).to.be.deep.equal([2, 3]);
    });

    it('retourne les totaux pour les sites entre 101 et 150 habitants', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 0, 1);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                input_date: new Date(2023, 0, 1),
                population_total: 100,
            }),
            fakeData({
                shantytown_id: 2,
                input_date: new Date(2023, 0, 1),
                population_total: 101,
                origins: 'other',
            }),
            fakeData({
                shantytown_id: 3,
                input_date: new Date(2023, 0, 1),
                population_total: 150,
                origins: 'european',
            }),
            fakeData({
                shantytown_id: 4,
                input_date: new Date(2023, 0, 1),
                population_total: 151,
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect(response[0].population_101_150.all).to.be.eql(251);
        expect(response[0].population_101_150.european).to.be.eql(150);
        expect(response[0].population_101_150.all_ids).to.be.deep.equal([2, 3]);
    });

    it('retourne les totaux pour les sites entre 151 et 200 habitants', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 0, 1);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                input_date: new Date(2023, 0, 1),
                population_total: 150,
            }),
            fakeData({
                shantytown_id: 2,
                input_date: new Date(2023, 0, 1),
                population_total: 151,
                origins: 'other',
            }),
            fakeData({
                shantytown_id: 3,
                input_date: new Date(2023, 0, 1),
                population_total: 200,
                origins: 'european',
            }),
            fakeData({
                shantytown_id: 4,
                input_date: new Date(2023, 0, 1),
                population_total: 201,
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect(response[0].population_151_200.all).to.be.eql(351);
        expect(response[0].population_151_200.european).to.be.eql(200);
        expect(response[0].population_151_200.all_ids).to.be.deep.equal([2, 3]);
    });

    it('retourne les totaux pour les sites entre 201 et 250 habitants', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 0, 1);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                input_date: new Date(2023, 0, 1),
                population_total: 200,
            }),
            fakeData({
                shantytown_id: 2,
                input_date: new Date(2023, 0, 1),
                population_total: 201,
                origins: 'other',
            }),
            fakeData({
                shantytown_id: 3,
                input_date: new Date(2023, 0, 1),
                population_total: 250,
                origins: 'european',
            }),
            fakeData({
                shantytown_id: 4,
                input_date: new Date(2023, 0, 1),
                population_total: 251,
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect(response[0].population_201_250.all).to.be.eql(451);
        expect(response[0].population_201_250.european).to.be.eql(250);
        expect(response[0].population_201_250.all_ids).to.be.deep.equal([2, 3]);
    });

    it('retourne les totaux pour les sites de 250 habitants ou plus', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 0, 1);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                input_date: new Date(2023, 0, 1),
                population_total: 250,
            }),
            fakeData({
                shantytown_id: 2,
                input_date: new Date(2023, 0, 1),
                population_total: 251,
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect(response[0].population_251_or_more.all).to.be.eql(251);
        expect(response[0].population_251_or_more.all_ids).to.be.deep.equal([2]);
    });

    it('si le modèle retourne une saisie > to, celle-ci est ignorée', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 0, 1);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                input_date: new Date(2023, 0, 2),
                population_total: 5,
            }),
            fakeData({
                shantytown_id: 2,
                input_date: new Date(2023, 0, 1),
                population_total: 10,
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect(response[0].all.all.number_of_people.total).to.be.eql(10);
    });

    it('une exception est lancée quand la lecture en base de données échoue', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 0, 1);
        const originalError = new Error('ceci est une erreur');
        dataReportModel.getRawData.rejects(originalError);

        try {
            await getTownsReport(from, to);
        } catch (error) {
            expect(error).to.be.an.instanceOf(ServiceError);
            expect(error.code).to.be.eql('model_failed');
            expect(error.nativeError).to.be.eql(originalError);
            return true;
        }

        fail('une exception aurait dû être lancée');
        return false;
    });
});
