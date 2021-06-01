const accessRequestService = require('#server/services/accessRequest/accessRequestService');
const mailService = require('#server/services/mailService');

module.exports = (agenda) => {
    agenda.define(
        'access_request_pending_1st',
        (job) => {
            const { userId } = job.attrs.data;
            accessRequestService.handleAccessRequestPending(true, parseInt(userId, 10));
        },
    );

    agenda.define(
        'access_request_pending_2nd',
        (job) => {
            const { userId } = job.attrs.data;
            accessRequestService.handleAccessRequestPending(false, parseInt(userId, 10));
        },
    );

    agenda.define(
        'access_is_pending',
        (job) => {
            const { accessId } = job.attrs.data;
            accessRequestService.handleAccessPending(parseInt(accessId, 10));
        },
    );

    agenda.define(
        'access_is_expired',
        (job) => {
            const { accessId } = job.attrs.data;
            accessRequestService.handleAccessExpired(parseInt(accessId, 10));
        },
    );

    agenda.define(
        'demo_invitation',
        (job) => {
            const { user } = job.attrs.data;
            mailService.send(
                'demo_invitation',
                user,
                null,
                [],
                mailService.PRESERVE_RECIPIENT,
            );
        },
    );
};
