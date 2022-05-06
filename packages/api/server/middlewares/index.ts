import appVersionMiddleware from './appVersionMiddleware';
import authMiddleware from './authMiddleware';
import charteMiddleware from './charteMiddleware';
import shantytownMiddleware from './shantytownMiddleware';
import validationMiddleware from './validationMiddleware';

export default {
    appVersion: appVersionMiddleware,
    auth: authMiddleware,
    charte: charteMiddleware,
    shantytown: shantytownMiddleware,
    validation: validationMiddleware,
};
