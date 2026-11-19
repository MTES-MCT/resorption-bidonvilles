import { expect } from 'chai';
import sinon from 'sinon';
import Excel from 'exceljs';
import { rewiremock } from '#test/rewiremock';

const sandbox = sinon.createSandbox();
const stubs = {
    getTownsReport: sandbox.stub(),
};

rewiremock('./getTownsReport').withDefault(stubs.getTownsReport);
rewiremock.passBy(/exceljs/);
rewiremock.passBy(/server\/utils\/excel/);

describe('services/dataReport/exportTownsReport()', () => {
    let exportTownsReport;

    beforeEach(async () => {
        rewiremock.enable();
        ({ default: exportTownsReport } = await rewiremock.module(() => import('./exportTownsReport')));
        stubs.getTownsReport.resolves([]);
    });

    afterEach(() => {
        rewiremock.disable();
        sandbox.reset();
    });

    it('nomme « Origine géographique » l\'entête de la colonne C', async () => {
        const buffer = await exportTownsReport(new Date(2024, 0, 1), new Date(2024, 0, 31));

        const workbook = new Excel.Workbook();
        await workbook.xlsx.load(buffer);
        const sheet = workbook.getWorksheet('Sites ouverts');

        expect(sheet.getCell('C1').value).to.be.equal('Origine géographique');
    });
});
