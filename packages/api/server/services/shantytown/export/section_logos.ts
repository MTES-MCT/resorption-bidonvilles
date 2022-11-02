import fs from 'fs';
import path from 'path';
import config from '#server/config';

const { assetsSrc } = config;

const {
    SectionType, Paragraph, ImageRun, HorizontalPositionRelativeFrom,
} = require('docx');

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
        floating: {
            horizontalPosition: {
                relative: HorizontalPositionRelativeFrom.RIGHT_MARGIN,
                offset: -1514400,
            },
            verticalPosition: {
                offset: 914400,
            },
        },

    });
    return {
        properties: {
            type: SectionType.CONTINUOUS,
        },
        children: [
            new Paragraph({
                children: [marianne, logoRb],
            }),
        ],
    };
};
