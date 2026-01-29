export type SigninLogFailureReason =
    | 'invalid_email_format'
    | 'invalid_password_format'
    | 'user_not_found'
    | 'inactive_account'
    | 'wrong_password'
    | 'rate_limited'
    | 'api_error';

export type SigninLog = {
    id: number;
    email: string;
    userId: number | null;
    attemptedAt: Date;
    responseTimeMs: number;
    success: boolean;
    failureReason: SigninLogFailureReason | null;
    ipAddress: string | null;
    userAgent: string | null;
    user?: {
        id: number;
        firstName: string;
        lastName: string;
    } | null;
};
