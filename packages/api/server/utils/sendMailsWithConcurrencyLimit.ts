import PromisePool from '@supercharge/promise-pool';

const MAIL_SEND_CONCURRENCY = 10;

const sendMailsWithConcurrencyLimit = async <T>(
    items: T[],
    sendOne: (item: T) => Promise<any>,
    onError: (error: Error, item: T) => void = null,
): Promise<void> => {
    let pool = PromisePool
        .for(items)
        .withConcurrency(MAIL_SEND_CONCURRENCY);

    if (onError !== null) {
        pool = pool.handleError(onError);
    }

    await pool.process(sendOne);
};

export default sendMailsWithConcurrencyLimit;
