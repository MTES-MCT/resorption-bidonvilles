import fs from 'fs';
import path from 'path';
import config from '#server/config';

import {
    SectionType, Paragraph, ImageRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle,
} from 'docx';

const { assetsSrc } = config;

export default () => {
    const marianne = new ImageRun({
        data: fs.readFileSync(path.join(assetsSrc, 'logo_gouvernement.jpg')),
        transformation: {
            width: 180,
            height: 100,
        },
    });
    const logoRb = new ImageRun({
        data: fs.readFileSync(path.join(assetsSrc, 'logo_rb.png')),
        transformation: {
            width: 144,
            height: 80,
        },
    });

    const logosTable = new Table({
        width: {
            size: 100,
            type: WidthType.PERCENTAGE,
        },
        borders: {
            top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
            bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
            left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
            right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
            insideHorizontal: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
            insideVertical: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
        },
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        borders: {
                            top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                            bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                            left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                            right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                        },
                        margins: {
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                        },
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.LEFT,
                                spacing: { before: 0, after: 0 },
                                children: [marianne],
                            }),
                        ],
                    }),
                    new TableCell({
                        borders: {
                            top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                            bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                            left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                            right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                        },
                        margins: {
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                        },
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.RIGHT,
                                spacing: { before: 0, after: 0 },
                                children: [logoRb],
                            }),
                        ],
                    }),
                ],
            }),
        ],
    });
    return {
        properties: {
            type: SectionType.CONTINUOUS,
        },
        children: [logosTable],
    };
};
