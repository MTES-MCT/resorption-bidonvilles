const userService = require('#server/services/userService');
const accessRequestService = require('#server/services/accessRequest/accessRequestService');

const {
    send: sendMail,
    PRESERVE_RECIPIENT,
} = require('#server/services/mailService');

const sendEmailNewContactMessageToAdmins = async (data, models, contact) => {
    const admins = await models.user.getNationalAdmins();

    for (let i = 0; i < admins.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await sendMail('contact_message', admins[i], contact, [data, new Date()], !PRESERVE_RECIPIENT);
    }
};

module.exports = models => ({
    async contact(req, res) {
        const { request_type, is_actor } = req.body;

        // user creation
        if (request_type.includes('access-request') && is_actor) {
            // create the user
            const result = await userService.create({
                last_name: req.body.last_name,
                first_name: req.body.first_name,
                email: req.body.email,
                phone: req.body.phone,
                organization: req.body.organization_full ? req.body.organization_full.id : null,
                new_association: req.body.new_association === true,
                new_association_name: req.body.new_association_name || null,
                new_association_abbreviation: req.body.new_association_abbreviation || null,
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
            } catch (err) {
                // ignore
            }

            return res.status(200).send(result);
        }

        // contact request
        try {
            await sendEmailNewContactMessageToAdmins(req.body, models, {
                email: req.body.email,
                last_name: req.body.last_name,
                first_name: req.body.first_name,
            });
        } catch (err) {
            // ignore
        }

        return res.status(200).send();
    },
});
