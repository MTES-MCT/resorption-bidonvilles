import userService from '#server/services/user/index';

const ERRORS = {
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

export default async (req, res, next) => {
    try {
        const updatedUser = await userService.refuse(req.params.id);
        res.status(200).send(updatedUser);
    } catch (error) {
        const { code, message } = ERRORS[error?.code] ?? ERRORS.undefined;
        res.status(code).send({
            user_message: message,
        });

        next(error?.nativeError ?? error);
    }
};
