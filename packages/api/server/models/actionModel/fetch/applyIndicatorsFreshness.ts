import computeIndicatorsFreshness from '../_common/computeIndicatorsFreshness';
import isActiveInYear from '../_common/isActiveInYear';
import { ActionHash } from './hashActions';

/**
 * Pose, pour chaque action, les drapeaux de fraîcheur des indicateurs. Une action inactive en N-1 est exclue en
 * entier : ses deux drapeaux « à jour » sont à false.
 */
/* eslint-disable no-param-reassign */
export default function applyIndicatorsFreshness(hash: ActionHash, referenceDate: Date): void {
    const previousYear = referenceDate.getFullYear() - 1;

    Object.values(hash).forEach((action) => {
        const isActive = isActiveInYear(action.started_at, action.ended_at, previousYear);
        const freshness = isActive
            ? computeIndicatorsFreshness(action.metrics, referenceDate)
            : { isUpToDate90Days: false, isUpToDate180Days: false };

        action.is_active_previous_year = isActive;
        action.indicators_up_to_date_90d = freshness.isUpToDate90Days;
        action.indicators_up_to_date_180d = freshness.isUpToDate180Days;
    });
}
