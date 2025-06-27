import createRow from '../create_row';
import electricityAccessStatusLabels from '../../_common/livingConditionsStatusLabels/electricityAccessStatusLabels';

export default (shantytown) => {
    const { status } = shantytown.livingConditions.electricity;

    return createRow([
        'Accès à l\'électricité',
        electricityAccessStatusLabels[status.status] ?? 'Aucune information concernant l\'accès à l\'électricité',
    ]);
};
