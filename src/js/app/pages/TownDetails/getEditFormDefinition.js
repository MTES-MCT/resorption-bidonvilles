import { get as getConfig, hasPermission } from '#helpers/api/config';
import {
    getDataJusticeInputs,
    getLifeConditionsInputs,
    getPeopleSectionInputs,
} from '#app/pages/TownCreate/getFormDefinition';

export default function getFormDefinition() {
    const {
        field_types: fieldTypes,
        owner_types: ownerTypes,
    } = getConfig();


    return [
        {
            title: '1. Situation du site',
            inputs: {
                priority: {
                    type: 'radio',
                    options: [
                        { label: '1', value: 1 },
                        { label: '2', value: 2 },
                        { label: '3', value: 3 },
                    ],
                    label: 'Niveau de priorité du site',
                    description: '1 étant le niveau de priorité le plus haut.<br/>Le niveau de priorité est un indicateur réservé aux correspondants des services de l’État.',
                    mandatory: false,
                },
                builtAt: {
                    type: 'date',
                    label: "Date d'installation du site",
                    mandatory: true,
                },
                declaredAt: {
                    type: 'date',
                    label: 'Date de signalement du site',
                    mandatory: false,
                },
            },
        },
        {
            title: '2. Localisation',
            inputs: {
                address: {
                    type: 'addressWithLocation',
                    label: 'Localisation géographique',
                    description: "Saisissez ici l'adresse du site, puis précisez sa position en déplaçant le point sur la carte.",
                    mandatory: true,
                },
                addressDetails: {
                    type: 'text',
                    label: "Informations d'accès",
                    description: 'Saisissez ici toutes les informations qui, en plus de l\'adresse, peuvent être utiles pour l\'accès au site.',
                    mandatory: false,
                },
                fieldType: {
                    type: 'radio',
                    options: fieldTypes.map(({ id, label }) => ({
                        label,
                        value: id,
                    })),
                    label: 'Type de site',
                    mandatory: true,
                },
                ownerType: {
                    type: 'radio',
                    options: ownerTypes.map(({ id, label }) => ({
                        label,
                        value: id,
                    })),
                    label: 'Type de propriétaire',
                    mandatory: true,
                },
                owner: {
                    type: 'text',
                    label: 'Identité du propriétaire',
                    condition({ ownerType }) {
                        return ownerType && ownerTypes.find(({ id }) => id === ownerType).label !== 'Inconnu';
                    },
                },
            },
        },
        {
            title: '3. Habitants',
            inputs: getPeopleSectionInputs(),
        },
        {
            title: '4. Conditions de vie',
            inputs: getLifeConditionsInputs(),
        },

        ...hasPermission('shantytown.create.data_justice')
            ? [{
                title: "5. Procédure judiciaire d'expulsion des occupants",
                inputs: getDataJusticeInputs(),
            }]
            : [],
    ];
}
