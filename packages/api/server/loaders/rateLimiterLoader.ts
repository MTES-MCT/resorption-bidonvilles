import rateLimit from 'express-rate-limit';

export default (app) => {
    const apiRequestLimiter = rateLimit({
        windowMs: 1 * 60 * 1000, // 1 minute
        max: 60, // max requests allowed per IP in the span of windowMs
    });

    app.use(apiRequestLimiter);
};
