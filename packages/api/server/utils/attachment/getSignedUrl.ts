import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3 } from '#server/utils/s3';
import config from '#server/config';

export default async (key: string | undefined) => {
    if (key === 'undefined') {
        return null;
    }
    const bucketFileSignedUrl = await getSignedUrl(
        S3,
        new GetObjectCommand({
            Bucket: config.S3.bucket,
            Key: key,
        }),
        { expiresIn: 86400 }, // 24 heures
    );
    return bucketFileSignedUrl;
};
