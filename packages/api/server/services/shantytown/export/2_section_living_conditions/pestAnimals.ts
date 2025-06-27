import createRow from '../create_row';
import pestAnimalsStatusLabels from '../../_common/livingConditionsStatusLabels/pestAnimalsStatusLabels';

export default (shantytown) => {
    const { status, details: comments } = shantytown.livingConditions.pest_animals;

    let text = pestAnimalsStatusLabels[status.status] ?? 'Aucune information concernant la présence de nuisibles';
    if (comments) {
        text = `${text} – ${comments}`;
    }

    return createRow(['Nuisibles', text]);
};
