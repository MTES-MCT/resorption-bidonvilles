import * as docx from 'docx';
import accessToWater from './2_section_living_conditions/accessToWater';
import trashEvacuation from './2_section_living_conditions/trashEvacuation';
import accessToElectricity from './2_section_living_conditions/accessToElectricity';
import accessToSanitary from './2_section_living_conditions/accessToSanitary';
import pestAnimals from './2_section_living_conditions/pestAnimals';
import heading from './heading';
import firePrevention from './2_section_living_conditions/firePrevention';

const {
    Table, SectionType, Paragraph, TextRun, PageOrientation,
} = docx;

export default (shantytown) => {
    const section: any = {
        properties: {
            type: SectionType.NEXT_PAGE,
            page: {
                size: {
                    orientation: PageOrientation.PORTRAIT,
                },
            },
        },
        children: [
            heading('Conditions de vie'),
        ],
    };

    if (shantytown.livingConditions.version === 2) {
        section.children.push(
            new Table({
                columnWidths: [2410, 7228], // total page width is 9638 DXA for A4 portrait
                rows: [
                    accessToElectricity(shantytown),
                    accessToWater(shantytown),
                    trashEvacuation(shantytown),
                    accessToSanitary(shantytown),
                    pestAnimals(shantytown),
                    firePrevention(shantytown),
                ],
            }),
        );
    } else {
        section.children.push(
            new Paragraph({
                spacing: {
                    before: 300,
                    after: 100,
                },
                children: [
                    new TextRun({
                        text: 'Nouveau : le formulaire des conditions de vie évolue pour être plus précis et plus exhaustif sur l\'accès à l\'eau, l\'électricité et aux toilettes. Mettez le à jour pour partager un état des lieux plus juste et identifier les besoins.',
                        break: 1,
                        color: '605F5F',
                        size: 22,
                        font: 'Arial',
                    }),
                ],
            }),
        );
    }

    return section;
};
