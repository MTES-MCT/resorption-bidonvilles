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
        const to = new Date(2023, 0, 1);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                known_since: new Date(2023, 0, 1),
                is_oversea: false,
            }),
            fakeData({
                shantytown_id: 2,
                known_since: new Date(2023, 0, 1),
                is_oversea: true,
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect(
            response[0].all_sizes.metropolitan.number_of_towns.total,
            'Le site métropolitain est correctement décompté',
        ).to.be.equal(1);
        expect(
            response[0].all_sizes.overseas.number_of_towns.total,
            'Le site ultramarin est correctement décompté',
        ).to.be.equal(1);
    });

    it('un site est correctement décompté dans le total des sites même si son dernier état connu précède `from`', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 0, 1);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                known_since: new Date(1998, 6, 12),
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect(response[0].all_sizes.metropolitan.number_of_towns.total).to.be.equal(1);
    });

    it('un site déclaré après la période demandée est quand meme compté si sa date d\'installation est dans la période demandée', async () => {
        const from = new Date(2023, 1, 1);
        const to = new Date(2023, 1, 1);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                known_since: new Date(2023, 0, 1),
                input_date: new Date(2023, 1, 15),
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect(response[0].all_sizes.metropolitan.number_of_towns.total).to.be.equal(1);
    });

    it('une saisie de fermeture est correctement ignorée dans le décompte de population', async () => {
        const from = new Date(2023, 0, 10);
        const to = new Date(2023, 0, 17);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                known_since: new Date(2023, 0, 1),
                input_date: new Date(2023, 0, 15),
                closed_at: new Date(2023, 0, 15),
                population_total: 5,
            }),
            fakeData({
                shantytown_id: 1,
                known_since: new Date(2023, 0, 1),
                input_date: new Date(2023, 0, 1),
                closed_at: new Date(2023, 0, 15),
                population_total: 5,
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect(
            response[0].all_sizes.metropolitan.number_of_people.total,
            'Le nombre d\'habitants devrait être comptabilisé avant la fermeture',
        ).to.be.equal(5);
        expect(
            response[1].all_sizes.metropolitan.number_of_people.total,
            'Le nombre d\'habitants ne devrait pas être comptabilisé après la fermeture',
        ).to.be.equal(0);
    });

    it('un site est correctement décompté dans le total des sites à chaque mois', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 2, 1);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                known_since: new Date(2023, 0, 1),
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect([
            response[0].all_sizes.metropolitan.number_of_towns.total,
            response[1].all_sizes.metropolitan.number_of_towns.total,
            response[2].all_sizes.metropolitan.number_of_towns.total,
        ]).to.be.deep.equal([1, 1, 1]);
    });

    it('un site n\'est plus décompté après sa fermeture', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 2, 1);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                known_since: new Date(2023, 0, 1),
                closed_at: new Date(2023, 1, 15),
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect([
            response[0].all_sizes.metropolitan.number_of_towns.total,
            response[1].all_sizes.metropolitan.number_of_towns.total,
            response[2].all_sizes.metropolitan.number_of_towns.total,
        ]).to.be.deep.equal([1, 1, 0]);
    });

    it('un site avec plusieurs saisies n\'est compté qu\'une seule fois', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 0, 31);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                known_since: new Date(2023, 0, 1),
                input_date: new Date(2023, 0, 1, 12, 0, 0),
            }),
            fakeData({
                shantytown_id: 1,
                known_since: new Date(2023, 0, 1),
                input_date: new Date(2023, 0, 1, 11, 0, 0),
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect(response[0].all_sizes.metropolitan.number_of_towns.total).to.be.eql(1);
    });

    it('une saisie faite à la date `to` est toujours prise en compte', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 3, 30);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                known_since: new Date(2023, 3, 30),
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect(response[0].all_sizes.metropolitan.number_of_towns.total).to.be.eql(0);
        expect(response[3].all_sizes.metropolitan.number_of_towns.total).to.be.eql(1);
    });

    it('une saisie faite à la date `to` est prise en compte même quand `from` et `to` sont du même mois', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 0, 31);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                known_since: new Date(2023, 0, 31),
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect(response[0].all_sizes.metropolitan.number_of_towns.total).to.be.eql(0);
        expect(response[1].all_sizes.metropolitan.number_of_towns.total).to.be.eql(1);
    });

    it('les sites de 10 personnes ou plus sont bien décomptés séparément', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 0, 1);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                known_since: new Date(2023, 0, 1),
                population_total: 10,
                is_oversea: false,
            }),
            fakeData({
                shantytown_id: 2,
                known_since: new Date(2023, 0, 1),
                is_oversea: false,
            }),
            fakeData({
                shantytown_id: 3,
                known_since: new Date(2023, 0, 1),
                population_total: 10,
                is_oversea: true,
            }),
            fakeData({
                shantytown_id: 4,
                known_since: new Date(2023, 0, 1),
                is_oversea: true,
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect(
            response[0].all_sizes.metropolitan.number_of_towns.total,
            'Le nombre de sites métropolitains est bien décompté',
        ).to.be.eql(2);
        expect(
            response[0].big_towns_only.metropolitan.number_of_towns.total,
            'Le nombre de sites métropolitains de plus de 10 personnes est bien décompté',
        ).to.be.eql(1);
        expect(
            response[0].all_sizes.overseas.number_of_towns.total,
            'Le nombre de sites ultramarins est bien décompté',
        ).to.be.eql(2);
        expect(
            response[0].big_towns_only.overseas.number_of_towns.total,
            'Le nombre de sites ultramarins de plus de 10 personnes est bien décompté',
        ).to.be.eql(1);
    });

    it('les différentes origines sont bien décomptées séparément', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 0, 1);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                known_since: new Date(2023, 0, 1),
                origins: 'european',
            }),
            fakeData({
                shantytown_id: 2,
                known_since: new Date(2023, 0, 1),
                origins: 'french',
            }),
            fakeData({
                shantytown_id: 3,
                known_since: new Date(2023, 0, 1),
                origins: 'other',
            }),
            fakeData({
                shantytown_id: 4,
                known_since: new Date(2023, 0, 1),
                origins: 'mixed',
            }),
            fakeData({
                shantytown_id: 5,
                known_since: new Date(2023, 0, 1),
                origins: null,
            }),
            fakeData({
                shantytown_id: 6,
                known_since: new Date(2023, 0, 1),
                origins: 'european',
                is_oversea: true,
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect(
            response[0].all_sizes.metropolitan.number_of_towns.total,
            'Le nombre total de sites est correct',
        ).to.be.eql(5);
        expect(
            response[0].all_sizes.metropolitan.number_of_towns.eu_only,
            'Le nombre total de sites intra UE est correct',
        ).to.be.eql(1);
        expect(
            response[0].all_sizes.metropolitan.number_of_towns.french_only,
            'Le nombre total de sites français est correct',
        ).to.be.eql(1);
        expect(
            response[0].all_sizes.metropolitan.number_of_towns.extra_eu_only,
            'Le nombre total de sites extra UE est correct',
        ).to.be.eql(1);
        expect(
            response[0].all_sizes.metropolitan.number_of_towns.mixed_origins,
            'Le nombre total de sites aux origines diverses est correct',
        ).to.be.eql(1);
        expect(
            response[0].all_sizes.metropolitan.number_of_towns.unknown_origins,
            'Le nombre total de sites aux origines inconnues est correct',
        ).to.be.eql(1);
        expect(
            response[0].all_sizes.overseas.number_of_towns.eu_only,
            'Le nombre total de sites aux origines intra UE en outremer est correct',
        ).to.be.eql(1);
    });

    it('les différentes origines sont bien décomptées pour les sites de 10 habitants ou plus', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 0, 1);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                known_since: new Date(2023, 0, 1),
                origins: 'french',
                population_total: 10,
            }),
            fakeData({
                shantytown_id: 2,
                known_since: new Date(2023, 0, 1),
                origins: 'french',
                population_total: 10,
                is_oversea: true,
            }),
            fakeData({
                shantytown_id: 3,
                known_since: new Date(2023, 0, 1),
                origins: 'french',
                population_total: 5,
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect(
            response[0].big_towns_only.metropolitan.number_of_towns.french_only,
            'Les origines sont bien décomptées pour les sites de 10 habitants ou plus en métropole',
        ).to.be.eql(1);
        expect(
            response[0].big_towns_only.overseas.number_of_towns.french_only,
            'Les origines sont bien décomptées pour les sites de 10 habitants ou plus en outremer',
        ).to.be.eql(1);
    });

    it('le nombre total de personnes est bien décompté', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 0, 1);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                known_since: new Date(2023, 0, 1),
                population_total: 5,
            }),
            fakeData({
                shantytown_id: 2,
                known_since: new Date(2023, 0, 1),
                population_total: 10,
            }),
            fakeData({
                shantytown_id: 3,
                known_since: new Date(2023, 0, 1),
                population_total: 6,
                is_oversea: true,
            }),
            fakeData({
                shantytown_id: 4,
                known_since: new Date(2023, 0, 1),
                population_total: 11,
                is_oversea: true,
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect(
            response[0].all_sizes.metropolitan.number_of_people.total,
            'Le nombre total de personnes en métropole est correct',
        ).to.be.eql(15);
        expect(
            response[0].big_towns_only.metropolitan.number_of_people.total,
            'Le nombre total de personnes dans des sites de 10 personnes ou + en métropole est correct',
        ).to.be.eql(10);
        expect(
            response[0].all_sizes.overseas.number_of_people.total,
            'Le nombre total de personnes en outremer est correct',
        ).to.be.eql(17);
        expect(
            response[0].big_towns_only.overseas.number_of_people.total,
            'Le nombre total de personnes dans des sites de 10 personnes ou + en outremer est correct',
        ).to.be.eql(11);
    });

    it('si un site a deux saisies au mois N et M, le nombre de personnes de ce site au mois N compte pour tous les mois jusqu\'à M - 1', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 3, 30);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                known_since: new Date(2022, 0, 1),
                input_date: new Date(2023, 3, 30),
                population_total: 30,
            }),
            fakeData({
                shantytown_id: 1,
                known_since: new Date(2022, 0, 1),
                input_date: new Date(2023, 3, 15),
                population_total: 15,
            }),
            fakeData({
                shantytown_id: 1,
                known_since: new Date(2022, 0, 1),
                input_date: new Date(2023, 2, 1),
                population_total: null,
            }),
            fakeData({
                shantytown_id: 1,
                known_since: new Date(2022, 0, 1),
                input_date: new Date(2022, 0, 1),
                population_total: 10,
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect(
            response[0].all_sizes.metropolitan.number_of_people.total,
            'Le nombre total de personnes est correct pour le mois de janvier',
        ).to.be.eql(10);
        expect(
            response[1].all_sizes.metropolitan.number_of_people.total,
            'Le nombre total de personnes est correct pour le mois de février',
        ).to.be.eql(10);
        expect(
            response[2].all_sizes.metropolitan.number_of_people.total,
            'Le nombre total de personnes est correct pour le mois de mars',
        ).to.be.eql(0);
        expect(
            response[3].all_sizes.metropolitan.number_of_people.total,
            'Le nombre total de personnes est correct pour le mois d\'avril',
        ).to.be.eql(30);
    });

    it('le nombre de personnes par origines est bien décompté', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 0, 1);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 1,
                origins: 'european',
            }),
            fakeData({
                shantytown_id: 2,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 2,
                origins: 'french',
            }),
            fakeData({
                shantytown_id: 3,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 3,
                origins: 'other',
            }),
            fakeData({
                shantytown_id: 4,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 4,
                origins: 'mixed',
            }),
            fakeData({
                shantytown_id: 5,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 5,
                origins: null,
            }),
            fakeData({
                shantytown_id: 6,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 6,
                origins: 'european',
                is_oversea: true,
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect(
            response[0].all_sizes.metropolitan.number_of_people.origins_european,
            'Le nombre de personnes intra UE en métropole est correct',
        ).to.be.eql(1);
        expect(
            response[0].all_sizes.metropolitan.number_of_people.origins_french,
            'Le nombre de personnes Françaises en métropole est correct',
        ).to.be.eql(2);
        expect(
            response[0].all_sizes.metropolitan.number_of_people.origins_other,
            'Le nombre de personnes extra UE en métropole est correct',
        ).to.be.eql(3);
        expect(
            response[0].all_sizes.metropolitan.number_of_people.origins_mixed,
            'Le nombre de personnes d\'origines diverses en métropole est correct',
        ).to.be.eql(4);
        expect(
            response[0].all_sizes.metropolitan.number_of_people.origins_null,
            'Le nombre de personnes d\'origines inconnues en métropole est correct',
        ).to.be.eql(5);
        expect(
            response[0].all_sizes.overseas.number_of_people.origins_european,
            'Le nombre de personnes intra UE en outremer est correct',
        ).to.be.eql(6);
    });

    it('le nombre de personnes par origines est bien décompté pour les sites de 10 personnes ou plus', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 0, 1);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 10,
                origins: 'european',
            }),
            fakeData({
                shantytown_id: 2,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 11,
                origins: 'french',
            }),
            fakeData({
                shantytown_id: 3,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 12,
                origins: 'other',
            }),
            fakeData({
                shantytown_id: 4,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 13,
                origins: 'mixed',
            }),
            fakeData({
                shantytown_id: 5,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 14,
                origins: null,
            }),
            fakeData({
                shantytown_id: 6,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 15,
                origins: 'european',
                is_oversea: true,
            }),
            fakeData({
                shantytown_id: 7,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 5,
                origins: 'european',
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect(
            response[0].big_towns_only.metropolitan.number_of_people.origins_european,
            'Le nombre de personnes intra UE en métropole est correct',
        ).to.be.eql(10);
        expect(
            response[0].big_towns_only.metropolitan.number_of_people.origins_french,
            'Le nombre de personnes Françaises en métropole est correct',
        ).to.be.eql(11);
        expect(
            response[0].big_towns_only.metropolitan.number_of_people.origins_other,
            'Le nombre de personnes extra UE en métropole est correct',
        ).to.be.eql(12);
        expect(
            response[0].big_towns_only.metropolitan.number_of_people.origins_mixed,
            'Le nombre de personnes d\'origines diverses en métropole est correct',
        ).to.be.eql(13);
        expect(
            response[0].big_towns_only.metropolitan.number_of_people.origins_null,
            'Le nombre de personnes d\'origines inconnues en métropole est correct',
        ).to.be.eql(14);
        expect(
            response[0].big_towns_only.overseas.number_of_people.origins_european,
            'Le nombre de personnes intra UE en outremer est correct',
        ).to.be.eql(15);
    });

    it('le nombre de mineurs est bien décompté', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 0, 1);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                origins: 'french',
                population_total: 5,
                population_minors: 1,
            }),
            fakeData({
                shantytown_id: 2,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                origins: 'european',
                population_total: 5,
                population_minors: 2,
            }),
            fakeData({
                shantytown_id: 3,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                origins: 'other',
                population_total: 5,
                population_minors: 3,
            }),
            fakeData({
                shantytown_id: 4,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                origins: 'mixed',
                population_total: 5,
                population_minors: 4,
            }),
            fakeData({
                shantytown_id: 5,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                origins: null,
                population_total: 5,
                population_minors: 5,
            }),
            fakeData({
                shantytown_id: 6,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                origins: 'french',
                population_total: 6,
                population_minors: 6,
                is_oversea: true,
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect(
            response[0].all_sizes.metropolitan.number_of_people.minors,
            'Le nombre total de mineurs en métropole est correct',
        ).to.be.eql(15);
        expect(
            response[0].all_sizes.overseas.number_of_people.minors,
            'Le nombre total de mineurs en outremer est correct',
        ).to.be.eql(6);
        expect(
            response[0].all_sizes.metropolitan.number_of_people.origins_french_minors,
            'Le nombre de mineurs Français en métropole est correct',
        ).to.be.eql(1);
        expect(
            response[0].all_sizes.metropolitan.number_of_people.origins_european_minors,
            'Le nombre de mineurs intra UE en métropole est correct',
        ).to.be.eql(2);
        expect(
            response[0].all_sizes.metropolitan.number_of_people.origins_other_minors,
            'Le nombre de mineurs extra UE en métropole est correct',
        ).to.be.eql(3);
        expect(
            response[0].all_sizes.metropolitan.number_of_people.origins_mixed_minors,
            'Le nombre de mineurs d\'origines diverses en métropole est correct',
        ).to.be.eql(4);
        expect(
            response[0].all_sizes.metropolitan.number_of_people.origins_null_minors,
            'Le nombre de mineurs d\'origines inconnues en métropole est correct',
        ).to.be.eql(5);
        expect(
            response[0].all_sizes.overseas.number_of_people.origins_french_minors,
            'Le nombre de mineurs Français en outremer est correct',
        ).to.be.eql(6);
    });

    it('le nombre de mineurs est bien décompté pour les sites de 10 personnes ou plus', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 0, 1);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                origins: 'french',
                population_total: 10,
                population_minors: 1,
            }),
            fakeData({
                shantytown_id: 2,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                origins: 'european',
                population_total: 10,
                population_minors: 2,
            }),
            fakeData({
                shantytown_id: 3,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                origins: 'other',
                population_total: 10,
                population_minors: 3,
            }),
            fakeData({
                shantytown_id: 4,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                origins: 'mixed',
                population_total: 10,
                population_minors: 4,
            }),
            fakeData({
                shantytown_id: 5,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                origins: null,
                population_total: 10,
                population_minors: 5,
            }),
            fakeData({
                shantytown_id: 6,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                origins: null,
                population_total: 5,
                population_minors: 5,
            }),
            fakeData({
                shantytown_id: 7,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                origins: null,
                population_total: 10,
                population_minors: 5,
                is_oversea: true,
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect(
            response[0].big_towns_only.metropolitan.number_of_people.minors,
            'Le nombre total de mineurs en métropole est correct',
        ).to.be.eql(15);
        expect(
            response[0].big_towns_only.metropolitan.number_of_people.origins_french_minors,
            'Le nombre de mineurs Français en métropole est correct',
        ).to.be.eql(1);
        expect(
            response[0].big_towns_only.metropolitan.number_of_people.origins_european_minors,
            'Le nombre de mineurs intra UE en métropole est correct',
        ).to.be.eql(2);
        expect(
            response[0].big_towns_only.metropolitan.number_of_people.origins_other_minors,
            'Le nombre de mineurs extra UE en métropole est correct',
        ).to.be.eql(3);
        expect(
            response[0].big_towns_only.metropolitan.number_of_people.origins_mixed_minors,
            'Le nombre de mineurs d\'origines diverses en métropole est correct',
        ).to.be.eql(4);
        expect(
            response[0].big_towns_only.metropolitan.number_of_people.origins_null_minors,
            'Le nombre de mineurs d\'origines inconnues en métropole est correct',
        ).to.be.eql(5);
    });

    it('retourne les totaux pour les sites entre 10 et 50 habitants', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 0, 1);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 9,
            }),
            fakeData({
                shantytown_id: 2,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 10,
                origins: 'other',
            }),
            fakeData({
                shantytown_id: 3,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 50,
                origins: 'european',
            }),
            fakeData({
                shantytown_id: 4,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 50,
                origins: 'european',
                is_oversea: true,
            }),
            fakeData({
                shantytown_id: 5,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 10,
                origins: 'other',
                is_oversea: true,
            }),
            fakeData({
                shantytown_id: 6,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 51,
                origins: 'european',
                is_oversea: true,
            }),
            fakeData({
                shantytown_id: 7,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 51,
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect(response[0].population_10_50.metropolitan.all, 'Le total des sites en métropole est correct').to.be.eql(2);
        expect(response[0].population_10_50.metropolitan.european, 'Le total des sites intra UE en métropole est correct').to.be.eql(1);
        expect(response[0].population_10_50.metropolitan.all_ids, 'La liste des sites en métropole est correct').to.be.deep.equal([2, 3]);
        expect(response[0].population_10_50.overseas.all, 'Le total des sites en outremer est correct').to.be.eql(2);
        expect(response[0].population_10_50.overseas.european, 'Le total des sites intra UE en outremer est correct').to.be.eql(1);
        expect(response[0].population_10_50.overseas.all_ids, 'La liste des sites en outremer est correct').to.be.deep.equal([4, 5]);
    });

    it('retourne les totaux pour les sites entre 51 et 100 habitants', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 0, 1);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 50,
            }),
            fakeData({
                shantytown_id: 2,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 51,
                origins: 'other',
            }),
            fakeData({
                shantytown_id: 3,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 100,
                origins: 'european',
            }),
            fakeData({
                shantytown_id: 4,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 51,
                origins: 'other',
                is_oversea: true,
            }),
            fakeData({
                shantytown_id: 5,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 100,
                origins: 'european',
                is_oversea: true,
            }),
            fakeData({
                shantytown_id: 6,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 101,
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect(response[0].population_51_100.metropolitan.all, 'Le total des sites en métropole est correct').to.be.eql(2);
        expect(response[0].population_51_100.metropolitan.european, 'Le total des sites intra UE en métropole est correct').to.be.eql(1);
        expect(response[0].population_51_100.metropolitan.all_ids, 'La liste des sites en métropole est correct').to.be.deep.equal([2, 3]);
        expect(response[0].population_51_100.overseas.all, 'Le total des sites en outremer est correct').to.be.eql(2);
        expect(response[0].population_51_100.overseas.european, 'Le total des sites intra UE en outremer est correct').to.be.eql(1);
        expect(response[0].population_51_100.overseas.all_ids, 'La liste des sites en outremer est correct').to.be.deep.equal([4, 5]);
    });

    it('retourne les totaux pour les sites entre 101 et 150 habitants', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 0, 1);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 100,
            }),
            fakeData({
                shantytown_id: 2,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 101,
                origins: 'other',
            }),
            fakeData({
                shantytown_id: 3,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 150,
                origins: 'european',
            }),
            fakeData({
                shantytown_id: 4,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 101,
                origins: 'other',
                is_oversea: true,
            }),
            fakeData({
                shantytown_id: 5,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 150,
                origins: 'european',
                is_oversea: true,
            }),
            fakeData({
                shantytown_id: 6,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 151,
                is_oversea: true,
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect(response[0].population_101_150.metropolitan.all, 'Le total des sites en métropole est correct').to.be.eql(2);
        expect(response[0].population_101_150.metropolitan.european, 'Le total des sites intra UE en métropole est correct').to.be.eql(1);
        expect(response[0].population_101_150.metropolitan.all_ids, 'La liste des sites en métropole est correct').to.be.deep.equal([2, 3]);
        expect(response[0].population_101_150.overseas.all, 'Le total des sites en outremer est correct').to.be.eql(2);
        expect(response[0].population_101_150.overseas.european, 'Le total des sites intra UE en outremer est correct').to.be.eql(1);
        expect(response[0].population_101_150.overseas.all_ids, 'La liste des sites en outremer est correct').to.be.deep.equal([4, 5]);
    });

    it('retourne les totaux pour les sites entre 151 et 200 habitants', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 0, 1);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 150,
            }),
            fakeData({
                shantytown_id: 2,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 151,
                origins: 'other',
            }),
            fakeData({
                shantytown_id: 3,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 200,
                origins: 'european',
            }),
            fakeData({
                shantytown_id: 4,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 151,
                origins: 'other',
                is_oversea: true,
            }),
            fakeData({
                shantytown_id: 5,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 200,
                origins: 'european',
                is_oversea: true,
            }),
            fakeData({
                shantytown_id: 6,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 201,
                is_oversea: true,
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect(response[0].population_151_200.metropolitan.all, 'Le total des sites en métropole est correct').to.be.eql(2);
        expect(response[0].population_151_200.metropolitan.european, 'Le total des sites intra UE en métropole est correct').to.be.eql(1);
        expect(response[0].population_151_200.metropolitan.all_ids, 'La liste des sites en métropole est correct').to.be.deep.equal([2, 3]);
        expect(response[0].population_151_200.overseas.all, 'Le total des sites en outremer est correct').to.be.eql(2);
        expect(response[0].population_151_200.overseas.european, 'Le total des sites intra UE en outremer est correct').to.be.eql(1);
        expect(response[0].population_151_200.overseas.all_ids, 'La liste des sites en outremer est correct').to.be.deep.equal([4, 5]);
    });

    it('retourne les totaux pour les sites entre 201 et 250 habitants', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 0, 1);

        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 200,
            }),
            fakeData({
                shantytown_id: 2,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 201,
                origins: 'other',
            }),
            fakeData({
                shantytown_id: 3,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 250,
                origins: 'european',
            }),
            fakeData({
                shantytown_id: 4,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 250,
                origins: 'european',
                is_oversea: true,
            }),
            fakeData({
                shantytown_id: 5,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 201,
                origins: 'other',
                is_oversea: true,
            }),
            fakeData({
                shantytown_id: 6,
                input_date: new Date(2023, 0, 1),
                population_total: 251,
                origins: 'european',
                is_oversea: true,
            }),
            fakeData({
                shantytown_id: 7,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 251,
                is_oversea: true,
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect(response[0].population_201_250.metropolitan.all, 'Le total des sites en métropole est correct').to.be.eql(2);
        expect(response[0].population_201_250.metropolitan.european, 'Le total des sites intra UE en métropole est correct').to.be.eql(1);
        expect(response[0].population_201_250.metropolitan.all_ids, 'La liste des sites en métropole est correct').to.be.deep.equal([2, 3]);
        expect(response[0].population_201_250.overseas.all, 'Le total des sites en outremer est correct').to.be.eql(2);
        expect(response[0].population_201_250.overseas.european, 'Le total des sites intra UE en outremer est correct').to.be.eql(1);
        expect(response[0].population_201_250.overseas.all_ids, 'La liste des sites en outremer est correct').to.be.deep.equal([4, 5]);
    });

    it('retourne les totaux pour les sites de 251 habitants ou plus', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 0, 1);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 251,
                origins: 'other',
            }),
            fakeData({
                shantytown_id: 2,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 252,
                origins: 'european',
            }),
            fakeData({
                shantytown_id: 3,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 251,
                origins: 'other',
                is_oversea: true,
            }),
            fakeData({
                shantytown_id: 4,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 252,
                origins: 'european',
                is_oversea: true,
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect(response[0].population_251_or_more.metropolitan.all, 'Le total des sites en métropole est correct').to.be.eql(2);
        expect(response[0].population_251_or_more.metropolitan.european, 'Le total des sites intra UE en métropole est correct').to.be.eql(1);
        expect(response[0].population_251_or_more.metropolitan.all_ids, 'La liste des sites en métropole est correct').to.be.deep.equal([1, 2]);
        expect(response[0].population_251_or_more.overseas.all, 'Le total des sites en outremer est correct').to.be.eql(2);
        expect(response[0].population_251_or_more.overseas.european, 'Le total des sites intra UE en outremer est correct').to.be.eql(1);
        expect(response[0].population_251_or_more.overseas.all_ids, 'La liste des sites en outremer est correct').to.be.deep.equal([3, 4]);
    });

    it('si le modèle retourne une saisie > to, celle-ci est ignorée', async () => {
        const from = new Date(2023, 0, 1);
        const to = new Date(2023, 0, 1);
        const rows: DataReportRawData[] = [
            fakeData({
                shantytown_id: 1,
                input_date: new Date(2023, 0, 2),
                known_since: new Date(2023, 0, 2),
                population_total: 5,
            }),
            fakeData({
                shantytown_id: 2,
                input_date: new Date(2023, 0, 1),
                known_since: new Date(2023, 0, 1),
                population_total: 10,
            }),
        ];
        dataReportModel.getRawData.resolves(rows);

        const response: TownReport[] = await getTownsReport(from, to);
        expect(response[0].all_sizes.metropolitan.number_of_people.total).to.be.eql(10);
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
