import { expect } from 'chai';
import buildPeopleSection from './section_people';

// `docx` construit un arbre XML interne : on descend récursivement dans `.root`
// pour collecter chaque chaîne de texte séparément (une entrée par TextRun).
const extractStrings = (section: any): string[] => {
    const strings: string[] = [];
    const walk = (node: unknown): void => {
        if (typeof node === 'string') {
            strings.push(node);
            return;
        }
        if (Array.isArray(node)) {
            node.forEach(walk);
            return;
        }
        if (node && typeof node === 'object' && 'root' in node) {
            walk((node as { root: unknown }).root);
        }
    };
    walk(section.children);
    return strings;
};

const buildShantytown = (socialOrigins: { id: number, label: string }[]): any => ({
    createdAt: new Date('2024-01-01T00:00:00.000Z').getTime() / 1000,
    changelog: [],
    censusStatus: 'none',
    socialOrigins,
});

describe('services/shantytown/export/section_people', () => {
    it('affiche le libellé « Origine géographique : »', () => {
        const strings = extractStrings(buildPeopleSection(buildShantytown([{ id: 1, label: 'Français' }])));

        expect(strings).to.include('Origine géographique : ');
        expect(strings).to.not.include('Origine : ');
    });

    it('joint les labels des origines par « , »', () => {
        const strings = extractStrings(buildPeopleSection(buildShantytown([
            { id: 1, label: 'Français' },
            { id: 2, label: 'Ressortissants européens' },
        ])));

        expect(strings).to.include('Français, Ressortissants européens');
    });

    it('affiche « non renseignée(s) » si la liste des origines est vide', () => {
        const strings = extractStrings(buildPeopleSection(buildShantytown([])));

        expect(strings).to.include('Origine géographique : ');
        expect(strings).to.include('non renseignée(s)');
    });
});
