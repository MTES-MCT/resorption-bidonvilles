import config from '#server/config';
import { S3 } from '#server/utils/s3';
import { CreateBucketCommand } from '@aws-sdk/client-s3';

export default () => S3.send(
    new CreateBucketCommand({ Bucket: config.S3.bucket }),
);
