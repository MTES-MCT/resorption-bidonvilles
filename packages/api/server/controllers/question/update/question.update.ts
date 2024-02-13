import questionService from '#server/services/question';

const ERRORS = {
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

export default async (req, res, next) => {
    if (req.user.role_id !== 'national_admin') {
        const question = await questionService.findOne(req.body.question_id);
        if (question.createdBy.id !== req.user.id) {
            return res.status(403).send({
                user_message: 'Vous n\'avez pas les droits suffisants pour modifier cette question',
            });
        }
    }

    try {
        const updateQuestion = await questionService.update(
            req.params.id,
            req.body,
            req.user.id,
        );

        return res.status(200).send(updateQuestion);
    } catch (error) {
        const { code, message } = ERRORS[error?.code] || ERRORS.undefined;
        res.status(code).send({
            user_message: message,
        });

        return next(error?.nativeError || error);
    }
};
