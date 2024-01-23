import { S3Client } from '@aws-sdk/client-s3';
import config from '#server/config';

export const S3 = new S3Client({
    endpoint: config.S3.endpoint,
    forcePathStyle: true,
    region: config.S3.region,
    credentials: {
        accessKeyId: config.S3.accessKeyId,
        secretAccessKey: config.S3.secretAccessKey,
    },
});

export default S3;
