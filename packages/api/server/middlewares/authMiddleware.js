const jwt = require('jsonwebtoken');
const Sentry = require('@sentry/node');
const { auth: authConfig } = require('#server/config');
const userModel = require('#server/models/userModel');

class AuthenticateError extends Error {
    constructor(details, ...args) {
        super(details.user_message, ...args);
        this.details = details;
    }
}

async function authenticate(req) {
    const token = (req.headers && req.headers['x-access-token']) || req.query.accessToken;

    if (!token) {
        throw new AuthenticateError({
            code: 1,
            user_message: 'Vous devez être connecté pour accéder à ce contenu',
        });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, authConfig.secret);
    } catch (error) {
        throw new AuthenticateError({
            code: 2,
            user_message: 'Votre session a expiré',
        });
    }

    const user = await userModel.findOne(decoded.userId, {
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

    Sentry.setUser({ id: user.id });

    const now = new Date();
    await userModel.update(user.id, {
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

function checkPermissions(mode, permissions, req, res, next, respond) {
    if (!req.user || !req.user.permissions || !permissions) {
        res.status(500).send({
            error: {
                code: 4,
                user_message: 'Vous n\'avez pas accès à ces données',
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

module.exports = {
    isSuperAdmin(req, res, next) {
        if (req.user.role_id !== 'national_admin') {
            return res.status(400).send({
                user_message: 'Vous n\'avez pas les permissions pour accéder à cette route',
            });
        }

        return next();
    },

    async authenticate(req, res, next, respond = true) {
        try {
            const user = await authenticate(req);
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
    },

    checkPermissions(permissions, req, res, next, respond = true) {
        return checkPermissions('every', permissions, req, res, next, respond);
    },

    checkOneOrMorePermissions(permissions, req, res, next, respond = true) {
        return checkPermissions('some', permissions, req, res, next, respond);
    },
};
