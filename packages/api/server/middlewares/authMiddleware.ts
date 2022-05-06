import jwt from 'jsonwebtoken';
import * as Sentry from '@sentry/node';
import config from '#server/config';
import userModelUpdate from '#server/models/userModel/update';
import userModelFindOne from '#server/models/userModel/findOne';

const { auth: authConfig } = config;

type AuthenticateErrorDetails = {
    code: number,
    user_message: string,
    developer_message: string
};

class AuthenticateError extends Error {
    details: AuthenticateErrorDetails;

    constructor(details: AuthenticateErrorDetails) {
        super(details.user_message);
        Object.setPrototypeOf(this, AuthenticateError.prototype);

        this.details = details;
    }
}

async function authenticateUser(req) {
    const token = (req.headers && req.headers['x-access-token']) || req.query.accessToken;

    if (!token) {
        throw new AuthenticateError({
            code: 1,
            user_message: 'Vous devez être connecté pour accéder à ce contenu',
            developer_message: 'The access token is missing',
        });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, authConfig.secret);
    } catch (error) {
        throw new AuthenticateError({
            code: 2,
            user_message: 'Votre session a expiré',
            developer_message: 'The access token is either invalid or expired',
        });
    }

    const user = await userModelFindOne(decoded.userId, {
        extended: true,
        app: true,
    });
    if (user === null) {
        throw new AuthenticateError({
            code: 3,
            user_message: 'Votre session a expiré',
            developer_message: 'The access token is either invalid or expired',
        });
    }

    if (user.status !== 'active' || user.organization.active !== true) {
        throw new AuthenticateError({
            code: 4,
            user_message: 'Votre session a expiré',
            developer_message: 'The access token is either invalid or expired',
        });
    }

    Sentry.setUser({ id: user.id });

    const now = new Date();
    await userModelUpdate(user.id, {
        last_access: now,
    });

    return user;
}

function hasPermission(permissions, permission) {
    const [entity, feature] = permission.split('.');

    return Object.prototype.hasOwnProperty.call(permissions, entity)
        && Object.prototype.hasOwnProperty.call(permissions[entity], feature)
        && permissions[entity][feature].allowed === true;
}

function myCheckPermissions(mode, permissions, req, res, next, respond) {
    if (!req.user || !req.user.permissions || !permissions) {
        res.status(500).send({
            error: {
                code: 4,
                user_message: 'Vous n\'avez pas accès à ces données',
                developer_message: 'Tried to access a secured page without authentication',
            },
        });

        if (respond !== true) {
            throw new Error('');
        }

        return;
    }

    if (!permissions[mode](permission => hasPermission(req.user.permissions, permission))) {
        res.status(400).send({
            error: {
                code: 5,
                user_message: 'Vous n\'avez pas accès à ces données',
                developer_message: 'Tried to access a secured page without all required permissions',
            },
        });

        if (respond !== true) {
            throw new Error('');
        }

        return;
    }

    if (respond === true) {
        next();
    }
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
        req.user.isAllowedTo = (feature, entity) => hasPermission(user.permissions, `${entity}.${feature}`);
    } catch (error) {
        if (respond !== true) {
            throw error;
        }

        res.status(400).send({
            error: error.details,
        });
        return;
    }

    if (respond === true) {
        next();
    }
}

export function checkPermissions(permissions, req, res, next, respond = true) {
    return myCheckPermissions('every', permissions, req, res, next, respond);
}

export function checkOneOrMorePermissions(permissions, req, res, next, respond = true) {
    return myCheckPermissions('some', permissions, req, res, next, respond);
}

export default {
    isSuperAdmin,
    authenticate,
    checkPermissions,
    checkOneOrMorePermissions,
};
