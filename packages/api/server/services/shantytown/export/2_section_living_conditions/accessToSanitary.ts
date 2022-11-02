import createRow from '../create_row';

export default (shantytown) => {
    const labels = {
        good: 'Accès à des toilettes existant',
        toImprove: 'Accès à des toilettes existant mais à améliorer',
        bad: 'Pas d\'accès à des toilettes',
    };
    const { status } = shantytown.livingConditions.sanitary;

    return createRow([
        'Accès à des toilettes fonctionnelles',
        labels[status.status] || 'Aucune information concernant l\'accès aux toilettes',
    ]);
};
