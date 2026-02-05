import rateLimit from 'express-rate-limit';
import signinLogService from '#server/services/signinLog';
import userModel from '#server/models/userModel';

const signinRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 3,
    skipSuccessfulRequests: true,
    keyGenerator: (req) => {
        const email = req.body?.email?.toLowerCase() || 'unknown';
        return email;
    },
    handler: async (req, res) => {
        const startTime = Date.now();
        const email = req.body?.email || null;
        const ipAddress = req.ip || req.connection?.remoteAddress || null;
        const userAgent = req.get('user-agent') || null;

        let userId = null;
        if (email && typeof email === 'string') {
            try {
                const user = await userModel.findOneByEmail(email);
                userId = user?.id || null;
            } catch {
                // Ignore errors, keep userId as null
            }
        }

        await signinLogService.logSigninAttempt({
            email,
            userId,
            success: false,
            failureReason: 'rate_limited',
            responseTimeMs: Date.now() - startTime,
            ipAddress,
            userAgent,
        });

        res.status(429).send({
            user_message: '<strong>Trop de tentatives de connexion</strong><br>Votre compte est bloqué pour une durée de 15 minutes.',
            code: 'rate_limited',
        });
    },
});

export default signinRateLimiter;
