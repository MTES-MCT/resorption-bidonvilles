import { S3 } from '#server/utils/s3';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import config from '#server/config';

const {
    bucket, expirationTime,
} = config.S3;

const expiresIn: number = Number(expirationTime);

export default async (key: string): Promise<string> => {
    const bucketParams = {
        Bucket: bucket,
        Key: key,
    };

    try {
        const command = new GetObjectCommand(bucketParams);
        const url = await getSignedUrl(S3, command, { expiresIn });
        return url;
    } catch (err) {
        throw new Error('Could not generate presigned URL');
    }
};
