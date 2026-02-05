import { QueryTypes } from 'sequelize';
import { sequelize } from '#db/sequelize';
import { SigninLog } from '#root/types/resources/SigninLog.d';
import serializeSigninLog from './_common/serializeSigninLog';
import validateSafeWhereClause from '../_common/validateSafeWhereClause';

type FindAllFilters = {
    email?: string;
    ipAddress?: string;
    success?: boolean;
    dateFrom?: Date;
    dateTo?: Date;
};

const findAll = async (filters: FindAllFilters = {}): Promise<SigninLog[]> => {
    const where = [];
    const replacements: any = {};

    if (filters.email) {
        where.push('LOWER(signin_logs.email) = LOWER(:email)');
        replacements.email = filters.email;
    }

    if (filters.ipAddress) {
        where.push('signin_logs.ip_address ILIKE :ipAddress');
        replacements.ipAddress = `%${filters.ipAddress}%`;
    }

    if (filters.success !== undefined) {
        where.push('signin_logs.success = :success');
        replacements.success = filters.success;
    }

    if (filters.dateFrom) {
        where.push('signin_logs.attempted_at >= :dateFrom');
        replacements.dateFrom = filters.dateFrom;
    }

    if (filters.dateTo) {
        where.push('signin_logs.attempted_at <= :dateTo');
        replacements.dateTo = filters.dateTo;
    }

    const whereConditions = where.join(' AND ');
    const whereClause = where.length > 0 ? `WHERE ${whereConditions}` : '';

    if (whereConditions) {
        validateSafeWhereClause(whereConditions);
    }

    const rows = await sequelize.query(
        `SELECT
            signin_logs.signin_log_id,
            signin_logs.email,
            signin_logs.fk_user,
            signin_logs.attempted_at,
            signin_logs.response_time_ms,
            signin_logs.success,
            signin_logs.failure_reason,
            signin_logs.ip_address,
            signin_logs.user_agent,
            users.user_id,
            users.first_name AS user_first_name,
            users.last_name AS user_last_name
        FROM signin_logs
        LEFT JOIN users ON signin_logs.fk_user = users.user_id
        ${whereClause}
        ORDER BY signin_logs.attempted_at DESC
        LIMIT 1000`,
        {
            type: QueryTypes.SELECT,
            replacements,
        },
    );

    return rows.map(serializeSigninLog);
};

export default findAll;
