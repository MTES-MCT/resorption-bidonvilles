import { expect } from 'chai';
import serializeExportProperties from './serializeExportProperties';

describe('services/shantytown/_common/serializeExportProperties', () => {
    describe('socialOrigins property', () => {
        let properties;

        beforeEach(() => {
            properties = serializeExportProperties([]);
        });

        it('a pour titre « Origine géographique »', () => {
            expect(properties.socialOrigins.title).to.be.equal('Origine géographique');
        });

        it('joint les labels des origines par « ; »', () => {
            const result = properties.socialOrigins.data({
                socialOrigins: [
                    { id: 1, label: 'Français' },
                    { id: 2, label: 'Ressortissants européens' },
                ],
            });

            expect(result).to.be.equal('Français;Ressortissants européens');
        });

        it('retourne null si aucune origine n\'est renseignée', () => {
            const result = properties.socialOrigins.data({ socialOrigins: [] });

            expect(result).to.be.null;
        });
    });
});
