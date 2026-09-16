import * as Sentry from '@sentry/node';
import PromisePool from '@supercharge/promise-pool';
import config from '#server/config';

const defaultOnError = <T>(error: Error, item: T): void => {
    Sentry.captureException(error, { extra: { item } });
};

const sendMailsWithConcurrencyLimit = async <T>(
    items: T[],
    sendOne: (item: T) => Promise<any>,
    onError: (error: Error, item: T) => void = defaultOnError,
): Promise<void> => {
    const pool = PromisePool
        .for(items)
        .withConcurrency(config.mail.sendConcurrency)
        .handleError(onError);

    await pool.process(sendOne);
};

export default sendMailsWithConcurrencyLimit;
