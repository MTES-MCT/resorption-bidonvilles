import PromisePool from '@supercharge/promise-pool';
import config from '#server/config';

const sendMailsWithConcurrencyLimit = async <T>(
    items: T[],
    sendOne: (item: T) => Promise<any>,
    onError: (error: Error, item: T) => void = null,
): Promise<void> => {
    let pool = PromisePool
        .for(items)
        .withConcurrency(config.mail.sendConcurrency);

    if (onError !== null) {
        pool = pool.handleError(onError);
    }

    await pool.process(sendOne);
};

export default sendMailsWithConcurrencyLimit;
