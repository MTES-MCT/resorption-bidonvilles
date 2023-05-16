import { Express } from 'express';

export default (override: Partial<Express.Multer.File> = {}) => {
    const f = {
        originalname: 'je suis une image.png',
        mimetype: 'image/png',
        size: 1024,
        buffer: 'test',
    };

    return { ...f, ...override };
};
