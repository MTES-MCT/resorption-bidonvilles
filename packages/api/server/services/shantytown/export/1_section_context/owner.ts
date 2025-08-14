import { Paragraph, TextRun } from 'docx';

export default (owners) => {
    const ownerLines = [];
    if (owners?.owners) {
        owners.owners.map((owner, index) => ownerLines.push(
            new TextRun({
                text: `Propriétaire ${index + 1} :`,
                bold: true,
                size: 22,
                break: 1,
                font: 'Arial',
            }),
            new TextRun({
                text: '    -    Type : ',
                size: 22,
                bold: true,
                break: 1,
                font: 'Arial',
            }),
            new TextRun({
                text: `${owner.typeDetails?.label ?? 'inconnu'}`,
                size: 22,
                font: 'Arial',
            }),
            new TextRun({
                text: '    -    Nom : ',
                size: 22,
                bold: true,
                break: 1,
                font: 'Arial',
            }),
            new TextRun({
                text: `${owner.name ?? 'non renseigné'}`,
                size: 22,
                font: 'Arial',
            }),
        ));
    } else {
        ownerLines.push(
            new TextRun({
                text: 'Propriétaire :',
                bold: true,
                size: 22,
                break: 1,
                font: 'Arial',
            }),
            new TextRun({
                text: 'Aucun propriétaire renseigné',
                size: 22,
                break: 1,
                font: 'Arial',
            }),
        );
    }

    return new Paragraph({
        spacing: {
            before: 150,
        },
        children: ownerLines,
    });
};
