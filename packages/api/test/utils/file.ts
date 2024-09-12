import { Readable } from 'stream';

const fakeFile = (override: Partial<Express.Multer.File> = {}) => {
    const f = {
          fieldname: 'file1',
          originalname: 'test1.txt',
          encoding: '7bit',
          mimetype: 'text/plain',
          size: 1024,
          stream: new Readable(),
          destination: '/uploads',
          filename: 'test1.txt',
          path: '/uploads/test1.txt',
          buffer: Buffer.from('This is a test file'),
        }
        return { ...f, ...override };
    }

export { fakeFile };
