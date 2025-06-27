import createRow from '../create_row';
import sanitaryAccessStatusLabels from '../../_common/livingConditionsStatusLabels/sanitaryAccessStatusLabels';

export default (shantytown) => {
    const { status } = shantytown.livingConditions.sanitary;

    return createRow([
        'Accès à des toilettes fonctionnelles',
        sanitaryAccessStatusLabels[status.status] ?? 'Aucune information concernant l\'accès aux toilettes',
    ]);
};
