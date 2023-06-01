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
            last_access_is_null: {
                // la précédence des opérateurs en SQL fait que le AND s'applique avant le OR
                query: 'users.last_access IS NULL AND (NOW() - users.created_at)',
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
