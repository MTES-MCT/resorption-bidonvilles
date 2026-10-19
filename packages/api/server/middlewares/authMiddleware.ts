import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import * as Sentry from '@sentry/node';
import config from '#server/config';
import findOneByEmail from '#server/models/userModel/findOneByEmail';
import { User } from '#root/types/resources/User.d';

const { auth: authConfig } = config;

type AuthenticateErrorDetails = {
    code: number,
    user_message: string,
};

export interface AuthUser extends User {
    isAllowedTo: Function
}

class AuthenticateError extends Error {
    details: AuthenticateErrorDetails;

    constructor(details: AuthenticateErrorDetails) {
        super(details.user_message);
        Object.setPrototypeOf(this, AuthenticateError.prototype);

        this.details = details;
    }
}

const MAGIC_TOKENS = {
    national_admin: {
        userId: 1,
    },
};

const keycloakClient = jwksClient({
    jwksUri: `https://${authConfig.keycloakHostname}/auth/realms/SISIAO/protocol/openid-connect/certs`,
    cache: true,
    rateLimit: true,
});

function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
    keycloakClient.getSigningKey(header.kid, (err, key) => {
        if (err) { return callback(err); }
        const signingKey = key?.getPublicKey();
        return callback(null, signingKey);
    });
}

async function authenticateUser(req) {
    const token = req.headers?.['x-access-token'] ?? req.query.accessToken;

    if (!token) {
        throw new AuthenticateError({
            code: 1,
            user_message: 'Vous devez être connecté pour accéder à ce contenu',
        });
    }

    let decoded;
    if (process.env.NODE_ENV === 'development' && MAGIC_TOKENS[token] !== undefined) {
        decoded = MAGIC_TOKENS[token];
    } else {
        try {
            decoded = await new Promise((resolve, reject) => {
                jwt.verify(token, getKey, (err, payload) => {
                    if (err) { reject(err); } else { resolve(payload); }
                });
            });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            throw new AuthenticateError({
                code: 2,
                user_message: 'Votre session a expiré',
            });
        }
    }

    const user = await findOneByEmail(decoded.email, {
        extended: true,
        app: true,
    });

    if (user === null) {
        throw new AuthenticateError({
            code: 3,
            user_message: 'Votre session a expiré',
        });
    }

    if (user.status !== 'active' || user.organization.active !== true) {
        throw new AuthenticateError({
            code: 4,
            user_message: 'Votre session a expiré',
        });
    }

    Sentry.setUser({ id: `${user.id}` });
    return user;
}

function hasPermission(permissions, permission): boolean {
    const [entity, feature] = permission.split('.');

    return Object.prototype.hasOwnProperty.call(permissions, entity)
        && Object.prototype.hasOwnProperty.call(permissions[entity], feature)
        && permissions[entity][feature].allowed === true;
}

export function isAdmin(req, res, next) {
    const { user }: { user: User } = req;
    if (user.is_admin !== true) {
        return res.status(400).send({
            user_message: 'Vous n\'avez pas les permissions pour accéder à cette route',
        });
    }

    return next();
}

export function isSuperAdmin(req, res, next) {
    if (req.user.role_id !== 'national_admin') {
        return res.status(400).send({
            user_message: 'Vous n\'avez pas les permissions pour accéder à cette route',
        });
    }

    return next();
}

export async function authenticate(req, res, next, respond = true) {
    try {
        const user = await authenticateUser(req);
        req.user = user;
        req.user.isAllowedTo = (feature: string, entity: string) => hasPermission(user.permissions, `${entity}.${feature}`);
    } catch (error) {
        if (respond !== true) {
            throw error;
        }

        res.status(400).send(error.details);
        return;
    }

    if (respond === true) {
        next();
    }
}

export default {
    isAdmin,
    isSuperAdmin,
    authenticate,
};
