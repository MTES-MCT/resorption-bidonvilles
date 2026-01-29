import { SigninLog, SigninLogFailureReason } from '#root/types/resources/SigninLog.d';

type RawSigninLog = {
    signin_log_id: number;
    email: string;
    fk_user: number | null;
    attempted_at: Date;
    response_time_ms: number;
    success: boolean;
    failure_reason: SigninLogFailureReason | null;
    ip_address: string | null;
    user_agent: string | null;
    user_id: number | null;
    user_first_name: string | null;
    user_last_name: string | null;
};

export default (raw: RawSigninLog): SigninLog => ({
    id: raw.signin_log_id,
    email: raw.email,
    userId: raw.fk_user,
    attemptedAt: raw.attempted_at,
    responseTimeMs: raw.response_time_ms,
    success: raw.success,
    failureReason: raw.failure_reason,
    ipAddress: raw.ip_address,
    userAgent: raw.user_agent,
    user: raw.user_id ? {
        id: raw.user_id,
        firstName: raw.user_first_name,
        lastName: raw.user_last_name,
    } : null,
});
