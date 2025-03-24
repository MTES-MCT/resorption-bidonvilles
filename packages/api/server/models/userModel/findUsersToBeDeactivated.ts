import config from '#server/config';
import query from './_common/query';

const { inactivityAlert: { delayBeforeDeactivation } } = config;

export default () => query(
    [
        {
            alert: {
                query: 'NOW() - users.inactivity_alert_sent_at',
                operator: '>',
                value: delayBeforeDeactivation,
            },
        },
        {
            fk_status: { value: 'active' },
        },
        {
            to_be_tracked: { value: true },
        },
    ],
);
