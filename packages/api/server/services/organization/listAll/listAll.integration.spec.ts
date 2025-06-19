import { expect } from 'chai';
import organizationAutocomplete from './listAll';

describe('organizationAutocomplete - test d\'intégration', () => {
    it('retourne correctement l\'organisation DIHAL avec ses vraies données', async () => {
        const results = await organizationAutocomplete('DIHAL');

        const dihals = results.filter(o => o.abbreviation?.toLowerCase() === 'dihal');

        expect(dihals.length).to.be.greaterThan(0);

        const dih = dihals[0];

        expect(dih.name).to.equal("Délégation Interministérielle à l'Hébergement et à l'Accès au Logement");
        expect(dih.similarity).to.be.greaterThan(0.75);
        expect(dih.abbreviation).to.be.equal('DIHAL');
        expect(dih.type).to.be.equal('Délégation interministérielle');
    });

    it('retourne une liste d\'organisations avec une similarité >= 0.75', async () => {
        const results = await organizationAutocomplete('loire');
    
        const highSimilarity = results.filter(o => o.similarity >= 0.75);
    
        expect(highSimilarity.length).to.be.greaterThan(0);
    
        const first = highSimilarity[0];
        expect(first.similarity).to.be.at.least(0.75);
        expect(first).to.have.property('name');
        expect(first).to.have.property('type');
    });
    
});
