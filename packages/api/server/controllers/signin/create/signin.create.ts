import userModel from '#server/models/userModel';
import authUtils from '#server/utils/auth';
import signinLogService from '#server/services/signinLog';
import signinRateLimitService from '#server/services/signinRateLimit';
import { SigninLogFailureReason } from '#root/types/resources/SigninLog.d';

const { generateAccessTokenFor, hashPassword } = authUtils;

// Messages centralisés
const ERROR_MESSAGES = {
    invalidCredentials: 'Ces identifiants sont incorrects',
    rateLimited: '<strong>Trop de tentatives de connexion</strong><br>Votre compte est bloqué pour une durée de 15 minutes.',
    inactiveAccount: 'Votre compte doit être actif pour permettre la connexion',
    invalidEmail: ['L\'adresse e-mail est invalide'],
    invalidPassword: ['Le mot de passe est invalide'],
} as const;

export default async (req, res) => {
    const startTime = Date.now();
    const { email, password } = req.body;
    const ipAddress = req.ip || req.connection?.remoteAddress || null;
    const userAgent = req.headers['user-agent'] || null;

    const logAttempt = async (userId: number | null, success: boolean, failureReason: SigninLogFailureReason | null) => {
        const responseTimeMs = Date.now() - startTime;
        await signinLogService.logSigninAttempt({
            email: email || 'inconnu',
            userId,
            success,
            failureReason,
            responseTimeMs,
            ipAddress,
            userAgent,
        });
    };

    if (typeof email !== 'string') {
        await logAttempt(null, false, 'invalid_email_format');
        return res.status(400).send({
            user_message: ERROR_MESSAGES.invalidCredentials,
            fields: {
                email: ERROR_MESSAGES.invalidEmail,
            },
        });
    }

    if (typeof password !== 'string') {
        await logAttempt(null, false, 'invalid_password_format');
        return res.status(400).send({
            user_message: ERROR_MESSAGES.invalidCredentials,
            fields: {
                password: ERROR_MESSAGES.invalidPassword,
            },
        });
    }

    const rateLimitCheck = await signinRateLimitService.checkRateLimit(email);
    if (rateLimitCheck.isBlocked) {
        await logAttempt(null, false, 'rate_limited');
        return res.status(429).send({
            user_message: ERROR_MESSAGES.rateLimited,
            code: 'rate_limited',
        });
    }

    let user;
    try {
        user = await userModel.findOneByEmail(email, {
            auth: true,
        });
    } catch (error) {
        await logAttempt(null, false, 'api_error');
        throw error;
    }

    if (user === null) {
        await logAttempt(null, false, 'user_not_found');
        if (rateLimitCheck.attemptCount >= 2) {
            return res.status(429).send({
                user_message: ERROR_MESSAGES.rateLimited,
                code: 'rate_limited',
            });
        }
        return res.status(403).send({
            user_message: ERROR_MESSAGES.invalidCredentials,
        });
    }

    if (user.status !== 'active') {
        await logAttempt(user.id, false, 'inactive_account');
        return res.status(400).send({
            user_message: ERROR_MESSAGES.inactiveAccount,
        });
    }

    const hashedPassword = hashPassword(password, user.salt);
    if (hashedPassword !== user.password) {
        await logAttempt(user.id, false, 'wrong_password');
        if (rateLimitCheck.attemptCount >= 2) {
            return res.status(429).send({
                user_message: ERROR_MESSAGES.rateLimited,
                code: 'rate_limited',
            });
        }
        return res.status(403).send({
            user_message: ERROR_MESSAGES.invalidCredentials,
        });
    }

    await userModel.resetInactivityAlertSentAt(user.id);
    await logAttempt(user.id, true, null);

    return res.status(200).send({
        token: generateAccessTokenFor(user),
    });
};
