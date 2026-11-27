import computeActionFreshness from '../_common/computeActionFreshness';
import { ActionHash } from './hashActions';

/**
 * Pose, pour chaque action, les drapeaux de fraîcheur des indicateurs. Une action inactive en N-1 est exclue en
 * entier : ses deux drapeaux « à jour » sont à false.
 */
/* eslint-disable no-param-reassign */
export default function applyIndicatorsFreshness(hash: ActionHash, referenceDate: Date): void {
    Object.values(hash).forEach((action) => {
        const freshness = computeActionFreshness(action.started_at, action.ended_at, action.metrics, referenceDate);

        action.is_active_previous_year = freshness.isActivePreviousYear;
        action.indicators_up_to_date_90d = freshness.isUpToDate90Days;
        action.indicators_up_to_date_180d = freshness.isUpToDate180Days;
    });
}
