import { rewiremock } from '#test/rewiremock';
import { expect } from 'chai';
import sinon from 'sinon';

const sandbox = sinon.createSandbox();
rewiremock.passBy(/initializeTownsReport/);

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

    it('retourne les données pour chaque date entre les deux fournies en paramètre', () => {
        const from = new Date(2022, 11, 12);
        const to = new Date(2023, 2, 24);
        const response = getTownsReport(from, to);
        expect(response).to.have.lengthOf(4);
        expect(response.map(({ date }) => date)).to.be.deep.equal([
            from,
            new Date(2023, 0, 1),
            new Date(2023, 1, 1),
            to,
        ]);
    });

    it('retourne les données uniquement pour la date `from` si `from` et `to` sont identiques', () => {
        const from = new Date(2023, 11, 12);
        const to = new Date(2023, 11, 12);
        const response = getTownsReport(from, to);
        expect(response).to.have.lengthOf(1);
    });

    it('retourne les données pour `from` et `to` si elles sont du même mois mais pas du même jour', () => {
        const from = new Date(2023, 11, 12);
        const to = new Date(2023, 11, 13);
        const response = getTownsReport(from, to);
        expect(response).to.have.lengthOf(2);
    });

    it('retourne un tableau vide si les dates sont incohérentes', () => {
        expect(getTownsReport(new Date('2023-03-24'), new Date('2022-12-12'))).to.be.eql([]);
    });
});
