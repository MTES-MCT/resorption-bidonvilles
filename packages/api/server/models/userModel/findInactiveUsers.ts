import config from '#server/config';
import query from './_common/query';

const { inactivityAlert: { delayBeforeAlert } } = config;

export default () => query(
    [
        {
            last_access: {
                query: 'NOW() - users.last_access',
                operator: '>',
                value: delayBeforeAlert,
            },
        },
        {
            inactivity_alert_sent_at: { value: null },
        },
        {
            fk_status: { value: 'active' },
        },
    ],
);
