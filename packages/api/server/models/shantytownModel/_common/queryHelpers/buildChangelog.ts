import { AuthUser } from '#server/middlewares/authMiddleware';
import { Shantytown } from '#root/types/resources/Shantytown.d';
import { RawPhase } from '#root/types/resources/ShantytownPreparatoryPhasesTowardResorption.d';
import serializeShantytown from '../serializeShantytown';
import getDiff from '../getDiff';
import { ShantytownRow } from '../SQL';

export default function buildChangelog(
    townsHash: { [key: number]: Shantytown },
    history: ShantytownRow[],
    user: AuthUser,
): void {
    if (!history || history.length === 0) {
        return;
    }

    /* eslint-disable no-param-reassign */

    const serializedHistory = history.map((h) => {
        const serialized = serializeShantytown(h, user);
        if (h.preparatoryPhasesTowardResorption?.length > 0) {
            const validPhases: RawPhase[] = (h.preparatoryPhasesTowardResorption as any[]).filter(p => p !== null && p !== undefined);
            serialized.preparatoryPhasesTowardResorption = validPhases.length > 0 ? validPhases as any : [];
        }
        return serialized;
    });

    for (let i = 1, { id } = serializedHistory[0]; i <= serializedHistory.length; i += 1) {
        if (id !== serializedHistory[i]?.id) {
            if (!townsHash[id]) {
                // eslint-disable-next-line no-continue
                continue;
            }

            const diff = getDiff(serializedHistory[i - 1], townsHash[id]);
            if (diff.length > 0) {
                townsHash[id].changelog.push({
                    author: townsHash[id].updatedBy,
                    date: townsHash[id].updatedAt,
                    diff,
                });
            }

            if (serializedHistory[i]) {
                ({ id } = serializedHistory[i]);
            }

            // eslint-disable-next-line no-continue
            continue;
        }

        const diff = getDiff(serializedHistory[i - 1], serializedHistory[i]);
        if (diff.length > 0) {
            townsHash[id].changelog.push({
                author: serializedHistory[i].updatedBy,
                date: serializedHistory[i].updatedAt,
                diff,
            });
        }
    }

    Object.keys(townsHash).forEach((shantytownId) => {
        townsHash[shantytownId].changelog = townsHash[shantytownId].changelog.slice().reverse();
    });
    /* eslint-enable no-param-reassign */
}
