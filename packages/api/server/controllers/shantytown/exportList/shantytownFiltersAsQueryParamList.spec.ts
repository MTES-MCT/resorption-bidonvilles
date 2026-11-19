import chai from 'chai';

import shantytownFiltersAsQueryParamList from './shantytownFiltersAsQueryParamList';

const { expect } = chai;

const statuses = ['open', 'inProgress', 'closed', 'resorbed'] as const;

describe('controllers/shantytown/exportList/shantytownFiltersAsQueryParamList', () => {
    it('expose les 4 statuts de site', () => {
        expect(Object.keys(shantytownFiltersAsQueryParamList)).to.have.members([...statuses]);
    });

    statuses.forEach((status) => {
        describe(`statut "${status}"`, () => {
            it('libelle le filtre origin « Origine géographique »', () => {
                expect(shantytownFiltersAsQueryParamList[status].origin).to.equal('Origine géographique');
            });

            it('conserve les libellés communs à tous les statuts', () => {
                expect(shantytownFiltersAsQueryParamList[status]).to.include({
                    population: 'Nombre de personnes',
                    fieldType: 'Type de sites',
                    target: 'Objectif résorption',
                    justice: 'Justice',
                    administrativeOrder: 'Ordre administratif',
                    rhi: 'RHI',
                });
            });
        });
    });

    ['open', 'inProgress'].forEach((status) => {
        it(`conserve les libellés spécifiques aux sites ouverts ou en cours (${status})`, () => {
            expect(shantytownFiltersAsQueryParamList[status]).to.include({
                conditions: 'Conditions de vie',
                actors: 'Intervenants',
                heatwave: 'Risque canicule',
            });
        });
    });

    ['closed', 'resorbed'].forEach((status) => {
        it(`conserve les libellés spécifiques aux sites fermés ou résorbés (${status})`, () => {
            expect(shantytownFiltersAsQueryParamList[status]).to.include({
                resorbedOrClosed: 'Résorbé / fermé',
                closingReason: 'Cause de la fermeture',
                closureYear: 'Année de fermeture',
            });
        });
    });
});
