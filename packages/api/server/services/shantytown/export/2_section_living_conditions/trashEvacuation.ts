import createRow from '../create_row';
import trashEvacuationStatusLabels from '../../_common/livingConditionsStatusLabels/trashEvacuationStatusLabels';

export default (shantytown) => {
    const { status } = shantytown.livingConditions.trash;

    return createRow([
        'Ramassage des déchets',
        trashEvacuationStatusLabels[status.status] ?? 'Aucune information concernant le ramassage des déchets',
    ]);
};
