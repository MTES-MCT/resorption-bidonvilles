
import Agenda from 'agenda';
import config from '#server/config';

const { agenda } = config;

let instance = null;

export default () => {
    if (instance === null) {
        instance = new Agenda({
            db: {
                address: agenda.mongo_address,
                options: { useUnifiedTopology: true },
            },
            processEvery: '40 seconds',
            defaultLockLifetime: 20 * 1000, // 20 seconds
        });
    }

    return instance;
};
