import { type Request, Response, NextFunction } from 'express';
import shantytownService from '#server/services/shantytown';
import { Location } from '#server/models/geoModel/Location.d';
import { AuthUser } from '#server/middlewares/authMiddleware';
import { ShantytownExportListOption } from '#root/types/resources/ShantytownExportTypes.d';
import { ExportedSitesStatus } from '#root/types/resources/exportedSitesStatus.d';
import shantytownFiltersAsQueryParamList from './shantytownFiltersAsQueryParamList';

const { exportTowns } = shantytownService;

const ERROR_RESPONSES = {
    fetch_failed: { code: 400, message: 'Une lecture en base de données a échoué' },
    permission_denied: { code: 403, message: 'Accès refusé' },
    write_failed: { code: 500, message: 'Une écriture en base de données a échoué' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

type FilterKeysForStatus<T extends ExportedSitesStatus> = T extends 'open'
    ? keyof typeof shantytownFiltersAsQueryParamList.open
    : T extends 'inProgress' ? keyof typeof shantytownFiltersAsQueryParamList.inProgress
        : T extends 'closed' ? keyof typeof shantytownFiltersAsQueryParamList.closed
            : never;

type FilterValues = string[];

type DynamicFilters<T extends ExportedSitesStatus> = {
    [K in FilterKeysForStatus<T>]?: FilterValues;
};

interface ExportTownsRequest<T extends ExportedSitesStatus> extends Request {
    user: AuthUser,
    body: {
        date: Date,
        exportedSitesStatus: T,
        location: Location,
    },
    query: {
        options: ShantytownExportListOption[],
    } & DynamicFilters<T>,
}

export default async <T extends ExportedSitesStatus>(req: ExportTownsRequest<T>, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { exportedSitesStatus } = req.body;

        const filters = {
            exportedSitesStatus,
            ...Object.keys(req.query)
                .filter(key => key !== 'options')
                .reduce((acc, key) => {
                    if (req.query[key]) {
                        acc[key] = req.query[key];
                    }
                    return acc;
                }, {} as Record<string, string[]>),
        };

        const buffer = await exportTowns(
            req.user,
            req.body.location,
            filters,
            req.query.options,
            req.body.date,
        );
        res.end(buffer);
    } catch (error) {
        const { code, message } = ERROR_RESPONSES[error?.code] ?? ERROR_RESPONSES.undefined;
        res.status(code).send({
            user_message: message,
        });
        next(error.nativeError ?? error);
    }
};
