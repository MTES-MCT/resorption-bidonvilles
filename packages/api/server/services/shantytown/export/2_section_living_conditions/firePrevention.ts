import createRow from '../create_row';
import firePreventionStatusLabels from '../../_common/livingConditionsStatusLabels/firePreventionStatusLabels';

export default (shantytown) => {
    const { status } = shantytown.livingConditions.fire_prevention;

    return createRow([
        'Diagnostic prévention incendie',
        firePreventionStatusLabels[status.status] ?? 'Aucune information concernant le diagnostic',
    ]);
};
