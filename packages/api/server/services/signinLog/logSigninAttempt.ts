import { sequelize } from '#db/sequelize';
import { SigninLogFailureReason } from '#root/types/resources/SigninLog.d';

type LogSigninAttemptParams = {
    email: string;
    userId: number | null;
    success: boolean;
    failureReason: SigninLogFailureReason | null;
    responseTimeMs: number;
    ipAddress: string | null;
    userAgent: string | null;
};

export default async ({
    email,
    userId,
    success,
    failureReason,
    responseTimeMs,
    ipAddress,
    userAgent,
}: LogSigninAttemptParams): Promise<void> => {
    try {
        await sequelize.query(
            `INSERT INTO signin_logs (
                email,
                fk_user,
                success,
                failure_reason,
                response_time_ms,
                ip_address,
                user_agent
            ) VALUES (
                :email,
                :userId,
                :success,
                :failureReason,
                :responseTimeMs,
                :ipAddress,
                :userAgent
            )`,
            {
                replacements: {
                    email,
                    userId,
                    success,
                    failureReason,
                    responseTimeMs,
                    ipAddress,
                    userAgent,
                },
            },
        );
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to log signin attempt:', error);
    }
};
