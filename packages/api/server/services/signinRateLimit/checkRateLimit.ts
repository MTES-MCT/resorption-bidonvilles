import signinLogModel from '#server/models/signinLogModel';

type CheckRateLimitResult = {
    isBlocked: boolean;
    attemptCount?: number;
    blockUntil?: Date;
};

/**
 * Vérifie si un utilisateur est bloqué suite à trop de tentatives de connexion échouées.
 * Règle : 3 tentatives échouées dans les 15 dernières minutes = blocage de 15 minutes.
 *
 * @param email - L'email de l'utilisateur
 * @returns Objet indiquant si l'utilisateur est bloqué et les détails
 */
const checkRateLimit = async (email: string): Promise<CheckRateLimitResult> => {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

    // Récupérer les tentatives de connexion des 15 dernières minutes
    const recentAttempts = await signinLogModel.findAll({
        email,
        dateFrom: fifteenMinutesAgo,
    });

    // Compter les échecs consécutifs depuis la dernière réussite
    const indexOfLastSuccess = recentAttempts.findIndex(attempt => attempt.success);
    const attemptsToConsider = indexOfLastSuccess === -1
        ? recentAttempts
        : recentAttempts.slice(0, indexOfLastSuccess);

    const failures = attemptsToConsider.filter(
        attempt => !attempt.success && attempt.failureReason !== 'rate_limited',
    );

    const consecutiveFailures = failures.length;
    const lastFailureDate = failures.length > 0
        ? new Date(Math.max(...failures.map(attempt => attempt.attemptedAt.getTime())))
        : null;

    // Si 3 échecs consécutifs en base, bloquer toute tentative suivante
    if (consecutiveFailures >= 3 && lastFailureDate) {
        const blockUntil = new Date(lastFailureDate.getTime() + 15 * 60 * 1000);
        const isStillBlocked = blockUntil > new Date();

        if (isStillBlocked) {
            return {
                isBlocked: true,
                attemptCount: consecutiveFailures,
                blockUntil,
            };
        }
    }

    return {
        isBlocked: false,
        attemptCount: consecutiveFailures,
    };
};

export default checkRateLimit;
