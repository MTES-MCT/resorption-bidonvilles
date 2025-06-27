import { Request, Response } from 'express';

import userService from '#server/services/user/index';
import contactService from '#server/services/contact/index';
import { User } from '#root/types/resources/User.d';
import { ContactBody } from '#root/types/inputs/ContactBody.d';

interface ContactRequest extends Request {
    body: ContactBody,
}

const ERRORS = {
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
    insert_failed: { code: 500, message: 'Une erreur est survenue lors de l\'enregistrement de votre demande en base de données' },
};

async function registerNewsletter(data: ContactBody): Promise<void> {
    if (data.request_type.includes('register-newsletter')) {
        try {
            await contactService.notifyNewsletterRegistration(data);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error registering newsletter:', error);
        }
    }
}

async function registerReferral(data: ContactBody, userId: number): Promise<void> {
    if (data.referral !== null) {
        try {
            await contactService.registerReferral({
                ...data,
                user_id: userId,
            });
        } catch (error) {
            // @todo register error to Sentry
        }
    }
}

async function processRequest(data: ContactBody): Promise<User | null> {
    if (data.request_type.includes('access-request') && data.is_actor && data.organization_category !== 'other') {
        return userService.register(data);
    }

    await contactService.notifyContact({
        ...data,
        is_new_organization: data.request_type.includes('access-request') && data.is_actor && data.organization_category === 'other',
    });
    return null;
}

export default async (req: ContactRequest, res: Response, next): Promise<void> => {
    let createdUser: User = null;

    await registerNewsletter(req.body);

    try {
        createdUser = await processRequest(req.body);
    } catch (error) {
        const { code, message } = ERRORS[error?.code] ?? ERRORS.undefined;
        res.status(code).send({ user_message: message });
        next(error?.nativeError ?? error);
        return;
    }

    await registerReferral(req.body, createdUser?.id);

    res.status(createdUser !== null ? 201 : 200).send(createdUser);
};
