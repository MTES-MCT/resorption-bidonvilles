import { expect } from 'chai';
import { validateDynamicSqlFragments } from '#server/models/shantytownModel/_common/query';

describe('shantytownModel/_common/query.validateDynamicSqlFragments', () => {
    it('accepte la formule de distance utilisée par findNearby (opérateurs arithmétiques)', () => {
        const distanceCalc = '(6371 * 2 * ASIN(SQRT( POWER(SIN(( :latitude - shantytowns.latitude) *  pi()/180 / 2), 2) +COS( :latitude * pi()/180) * COS(shantytowns.latitude * pi()/180) * POWER(SIN(( :longitude - shantytowns.longitude) * pi()/180 / 2), 2) )))';

        expect(() => validateDynamicSqlFragments(
            { [distanceCalc]: 'distance' },
            [],
            null,
        )).to.not.throw();
    });

    it('accepte une sélection simple de type table.colonne', () => {
        expect(() => validateDynamicSqlFragments(
            { 'shantytowns.shantytown_id': 'id' },
            [],
            null,
        )).to.not.throw();
    });

    it('rejette une clé de sélection contenant une tentative d\'injection SQL', () => {
        expect(() => validateDynamicSqlFragments(
            { '1; DROP TABLE shantytowns; --': 'distance' },
            [],
            null,
        )).to.throw('Invalid input');
    });

    it('rejette un alias de sélection invalide', () => {
        expect(() => validateDynamicSqlFragments(
            { 'shantytowns.shantytown_id': 'id\'; DROP TABLE shantytowns;' },
            [],
            null,
        )).to.throw('Invalid input');
    });

    it('rejette une clé de sélection contenant une sous-requête SQL', () => {
        expect(() => validateDynamicSqlFragments(
            { '(SELECT password FROM users)': 'distance' },
            [],
            null,
        )).to.throw('Invalid input');
    });
});
