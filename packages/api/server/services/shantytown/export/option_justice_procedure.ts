import {
    Paragraph, TextRun, SectionType,
} from 'docx';
import formatDate from '../_common/formatDate';

import heading from './heading';

const boolToStr = (bool) => {
    if (bool === null) {
        return 'NC';
    }
    return bool ? 'oui' : 'non';
};
const justiceRendered = (town) => {
    if (town.justiceRendered === null) {
        return 'NC';
    }
    return town.justiceRendered
        ? `rendue le ${formatDate(
            town.justiceRenderedAt,
            'DD MMMM YYYY',
        )}`
        : 'non';
};

const policeStatusLabel = (town) => {
    if (town.policeStatus === 'none') {
        return 'Non demandé';
    }

    if (town.policeStatus === 'requested') {
        return `Demandé le ${formatDate(
            town.policeRequestedAt,
            'd/m/y',
        )}`;
    }

    if (town.policeStatus === 'granted') {
        return `Accordé le ${formatDate(
            town.policeGrantedAt,
            'd/m/y',
        )}`;
    }
    return 'NC';
};

const administrativeOrderDecisionAt = (town) => {
    if (town.administrativeOrderDecisionAt === null) {
        return 'NC';
    }
    return town.administrativeOrderDecisionAt
        ? `rendue le ${formatDate(
            town.administrativeOrderDecisionAt,
            'DD MMMM YYYY',
        )}`
        : 'non';
};

const evacuationAt = (town) => {
    if (town.administrativeOrderEvacuationAt === null) {
        return 'NC';
    }
    return town.administrativeOrderEvacuationAt
        ? `${formatDate(
            town.administrativeOrderEvacuationAt,
            'DD MMMM YYYY',
        )}`
        : 'non';
};

const insalubrityOrder = (town) => {
    if (town.insalubrityOrder === null) {
        return 'NC';
    }

    return town.insalubrityOrder
        ? `${`${town.insalubrityOrderType} `}rendue le ${formatDate(
            town.insalubrityOrderAt,
            'DD MMMM YYYY',
        )}`
        : 'non';
};

export default town => ({
    properties: {
        type: SectionType.CONTINUOUS,
    },
    children: [
        heading('Procédure judiciaire ou administrative'),
        new Paragraph({
            spacing: {
                before: 300,
            },
            children: [
                new TextRun({
                    text: 'Dépôt de plainte par le propriétaire : ',
                    bold: true,
                    size: 22,
                    font: 'Arial',
                }),
                new TextRun({
                    text: `${boolToStr(town.ownerComplaint)}`,
                    bold: false,
                    size: 22,
                    font: 'Arial',
                }),
            ],
        }),
        new Paragraph({
            spacing: {
                before: 100,
            },
            children: [
                new TextRun({
                    text: 'Existence d\'une procédure judiciaire : ',
                    bold: true,
                    break: 1,
                    size: 22,
                    font: 'Arial',
                }),
                new TextRun({
                    text: `${boolToStr(town.justiceProcedure)}`,
                    bold: false,
                    size: 22,
                    font: 'Arial',
                }),
                new TextRun({
                    text: 'Décision de justice : ',
                    bold: true,
                    break: 1,
                    size: 22,
                    font: 'Arial',
                }),
                new TextRun({
                    text: `${justiceRendered(town)}`,
                    bold: false,
                    size: 22,
                    font: 'Arial',
                }),
                new TextRun({
                    text: 'Origine de la décision : ',
                    bold: true,
                    break: 1,
                    size: 22,
                    font: 'Arial',
                }),
                new TextRun({
                    text: `${town.justiceRenderedBy || 'NC'}`,
                    bold: false,
                    size: 22,
                    font: 'Arial',
                }),
                new TextRun({
                    text: 'Appel en cours : ',
                    bold: true,
                    break: 1,
                    size: 22,
                    font: 'Arial',
                }),
                new TextRun({
                    text: `${boolToStr(town.justiceChallenged)}`,
                    bold: false,
                    size: 22,
                    font: 'Arial',
                }),
            ],
        }),
        new Paragraph({
            spacing: {
                before: 100,
            },
            children: [
                new TextRun({
                    text: 'Arrêté d\'évacuation en cours : ',
                    bold: true,
                    break: 1,
                    size: 22,
                    font: 'Arial',
                }),
                new TextRun({
                    text: `${town.evacuationUnderTimeLimit === true ? administrativeOrderDecisionAt(town) : boolToStr(town.evacuationUnderTimeLimit) || 'NC'}`,
                    bold: false,
                    size: 22,
                    font: 'Arial',
                }),
                new TextRun({
                    text: 'Qui a pris l\'arrêté : ',
                    bold: true,
                    break: 1,
                    size: 22,
                    font: 'Arial',
                }),
                new TextRun({
                    text: `${town.administrativeOrderDecisionRenderedBy || 'NC'}`,
                    bold: false,
                    size: 22,
                    font: 'Arial',
                }),
                new TextRun({
                    text: 'Date de l\'arrêté : ',
                    bold: true,
                    break: 1,
                    size: 22,
                    font: 'Arial',
                }),
                new TextRun({
                    text: `${evacuationAt(town.administrativeOrderEvacuationAt)}`,
                    bold: false,
                    size: 22,
                    font: 'Arial',
                }),
            ],
        }),
        new Paragraph({
            spacing: {
                before: 100,
            },
            children: [
                new TextRun({
                    text: 'Arrêté d\'insalubrité RHI bidonville en cours : ',
                    bold: true,
                    break: 1,
                    size: 22,
                    font: 'Arial',
                }),
                new TextRun({
                    text: `${insalubrityOrder(town)}`,
                    bold: false,
                    size: 22,
                    font: 'Arial',
                }),
                new TextRun({
                    text: 'Affichage de l\'arrêté d\'insalubrité : ',
                    bold: true,
                    break: 1,
                    size: 22,
                    font: 'Arial',
                }),
                new TextRun({
                    text: `${boolToStr(town.insalubrityOrderDisplayed)}`,
                    bold: false,
                    size: 22,
                    font: 'Arial',
                }),
                new TextRun({
                    text: 'Qui a pris l\'arrêté d\'insalubrité : ',
                    bold: true,
                    break: 1,
                    size: 22,
                    font: 'Arial',
                }),
                new TextRun({
                    text: `${town.insalubrityOrderBy || 'NC'}`,
                    bold: false,
                    size: 22,
                    font: 'Arial',
                }),
                new TextRun({
                    text: 'Parcelles concernées : ',
                    bold: true,
                    break: 1,
                    size: 22,
                    font: 'Arial',
                }),
                new TextRun({
                    text: `${town.insalubrityParcels || 'NC'}`,
                    bold: false,
                    size: 22,
                    font: 'Arial',
                }),
            ],
        }),
        new Paragraph({
            spacing: {
                before: 100,
                after: 100,
            },
            children: [
                new TextRun({
                    text: 'Concours de la force publique : ',
                    bold: true,
                    break: 1,
                    size: 22,
                    font: 'Arial',
                }),
                new TextRun({
                    text: `${policeStatusLabel(town)}`,
                    bold: false,
                    size: 22,
                    font: 'Arial',
                }),
                new TextRun({
                    text: 'Nom de l\'étude d\'huissiers : ',
                    bold: true,
                    break: 1,
                    size: 22,
                    font: 'Arial',
                }),
                new TextRun({
                    text: `${town.bailiff || 'NC'}`,
                    bold: false,
                    size: 22,
                    font: 'Arial',
                }),
                new TextRun({
                    text: 'Existence d\'un contentieux : ',
                    bold: true,
                    break: 1,
                    size: 22,
                    font: 'Arial',
                }),
                new TextRun({
                    text: `${boolToStr(town.existingLitigation) || 'NC'}`,
                    bold: false,
                    size: 22,
                    font: 'Arial',
                }),
            ],
        }),
    ],
});
