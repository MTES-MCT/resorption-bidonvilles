import { S3 } from '#server/utils/s3';
import { ListBucketsCommand } from '@aws-sdk/client-s3';

export default () => S3.send(
    new ListBucketsCommand({}),
);
