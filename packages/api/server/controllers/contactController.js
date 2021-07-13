const { toString: dateToString } = require('#server/utils/date');

const userService = require('#server/services/userService');
const accessRequestService = require('#server/services/accessRequest/accessRequestService');

const { sendAdminContactMessage } = require('#server/mails/mails');

const sendEmailNewContactMessageToAdmins = async (models, message) => {
    const admins = await models.user.getNationalAdmins();

    for (let i = 0; i < admins.length; i += 1) {
        sendAdminContactMessage(admins[i], {
            variables: {
                message: {
                    created_at: dateToString(new Date()),
                    ...message,
                },
            },
            preserveRecipient: false,
            replyTo: {
                email: message.email,
                last_name: message.last_name,
                first_name: message.first_name,
            },
        });
    }
};

// Convert request-type to a message objet for the contact mail
// ie: [help, report] becomes "Aider - Signaler"
function getObjetForContactMessage(requestType) {
    const types = {
        help: 'Aider',
        report: 'Signaler',
        'help-request': "Demander de l'aide",
        'info-request': 'Demander des infos',
    };
    return requestType.map(type => types[type]).join(' - ');
}

module.exports = models => ({
    async contact(req, res, next) {
        const {
            request_type, is_actor, referral, referral_other, referral_word_of_mouth,
        } = req.body;

        // user creation
        if (request_type.includes('access-request') && is_actor) {
            // create the user
            const result = await userService.create({
                last_name: req.body.last_name,
                first_name: req.body.first_name,
                email: req.body.email,
                phone: req.body.phone,
                organization: req.body.organization_full
                    ? req.body.organization_full.id
                    : null,
                new_association: req.body.new_association === true,
                new_association_name: req.body.new_association_name || null,
                new_association_abbreviation:
          req.body.new_association_abbreviation || null,
                departement: req.body.departement || null,
                position: req.body.position,
                access_request_message: req.body.access_request_message,
            });

            if (result.error) {
                return res.status(result.error.code).send(result.error.response);
            }

            try {
                const user = await models.user.findOne(result.id, { extended: true });
                await accessRequestService.handleNewAccessRequest(user);

                if (referral !== null) {
                    await models.contactFormReferral.create({
                        reason: referral,
                        reason_other: referral_other,
                        reason_word_of_mouth: referral_word_of_mouth,
                        fk_user: user.id,
                    });
                }
            } catch (err) {
                next(err);
            }

            return res.status(200).send(result);
        }

        // contact request
        try {
            await sendEmailNewContactMessageToAdmins(models, {
                email: req.body.email,
                phone: req.body.phone,
                last_name: req.body.last_name,
                first_name: req.body.first_name,
                access_request_message: req.body.access_request_message,
                objet: getObjetForContactMessage(req.body.request_type),
            });

            if (referral !== null) {
                await models.contactFormReferral.create({
                    reason: referral,
                    reason_other: referral_other,
                    reason_word_of_mouth: referral_word_of_mouth,
                });
            }
        } catch (err) {
            next(err);
        }

        return res.status(200).send();
    },
});
