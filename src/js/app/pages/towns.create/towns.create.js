import NavBar from '#app/layouts/navbar/navbar.vue';
import { get as getConfig, hasPermission } from '#helpers/api/config';
import Form from '#app/components/form/form.vue';
import { add } from '#helpers/api/town';
import { link } from '#helpers/api/plan';

export default {
    components: {
        NavBar,
        Form,
    },
    data() {
        const {
            field_types: fieldTypes,
            owner_types: ownerTypes,
            social_origins: socialOrigins,
            electricity_types: electricityTypes,
        } = getConfig();

        const censusStatuses = [
            { value: 'none', label: 'Non prévu' },
            { value: 'scheduled', label: 'Prévu' },
            { value: 'done', label: 'Réalisé' },
            { value: null, label: 'Inconnu' },
        ];

        const yesNoValues = [
            { value: 1, label: 'Oui' },
            { value: 0, label: 'Non' },
            { value: -1, label: 'Inconnu' },
        ];

        const cfpValues = [
            { value: 'none', label: 'Non demandé' },
            { value: 'requested', label: 'Demandé' },
            { value: 'granted', label: 'Obtenu' },
            { value: null, label: 'Inconnu' },
        ];

        const formDefinition = {
            title: 'Déclaration d\'un site',
            description: 'Ce formulaire vous permet de déclarer un site identifié sur votre territoire (bidonville ou squat). Il est divisé en quatre onglets : caractéristiques, démographie, conditions de vie et procédure judiciaire d\'expulsion des occupants. Lorsque le symbole (*) apparaît en rouge au début de l\'intitulé de la question, cela signifie qu\'il s\'agit d\'une question obligatoire. Il n\'est pas possible de valider le formulaire sans y avoir répondu.',
            steps: [
                {
                    title: 'Caractéristiques du site',
                    sections: [
                        ...[
                            {
                                title: 'Caractéristiques',
                                inputs: {
                                    address: {
                                        type: 'addressWithLocation',
                                        label: 'Localisation géographique',
                                        description: 'Saisissez ici l\'adresse du site, puis précisez sa position en déplaçant le point sur la carte.',
                                        mandatory: true,
                                    },
                                    name: {
                                        type: 'text',
                                        label: 'Appellation du site',
                                        description: 'Nom d\'usage du site s\'il est différent de l\'adresse. Ex "Entrepôt de la Poste" (35 caractères maximum)',
                                        mandatory: false,
                                    },
                                    addressDetails: {
                                        type: 'text',
                                        label: 'Informations d\'accès',
                                        description: 'Saisissez ici toutes les informations qui, en plus de l\'adresse, peuvent être utiles pour l\'accès au site.',
                                        mandatory: false,
                                    },
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
                                        label: 'Date d\'installation du site',
                                        mandatory: true,
                                    },
                                    declaredAt: {
                                        type: 'date',
                                        label: 'Date de signalement du site',
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
                                title: 'Habitants',
                                inputs: {
                                    censusStatus: {
                                        type: 'radio',
                                        options: censusStatuses,
                                        label: 'Statut du diagnostic social',
                                        description: 'Un diagnostic social vise à identifier les situations et besoins des familles et personnes, de repérer le contexte territorial et les acteurs en présence.',
                                        mandatory: true,
                                    },
                                    censusConductedAt: {
                                        type: 'date',
                                        label: 'Date du diagnostic',
                                        mandatory: true,
                                        condition({ censusStatus }) {
                                            return ['scheduled', 'done'].indexOf(censusStatus) !== -1;
                                        },
                                    },
                                    censusConductedBy: {
                                        type: 'text',
                                        label: 'Service ou opérateur en charge du diagnostic',
                                        mandatory: true,
                                        condition({ censusStatus }) {
                                            return ['scheduled', 'done'].indexOf(censusStatus) !== -1;
                                        },
                                    },
                                    populationTotal: {
                                        type: 'number',
                                        label: 'Nombre de personnes',
                                        description: 'Laissez ce champ vide si l\'information est inconnue',
                                        mandatory: false,
                                    },
                                    populationCouples: {
                                        type: 'number',
                                        label: 'Nombre de ménages',
                                        description: 'Laissez ce champ vide si l\'information est inconnue',
                                        mandatory: false,
                                    },
                                    populationMinors: {
                                        type: 'number',
                                        label: 'Nombre de mineurs',
                                        description: 'Laissez ce champ vide si l\'information est inconnue',
                                        mandatory: false,
                                    },
                                    socialOrigins: {
                                        type: 'checkbox',
                                        options: socialOrigins.map(({ id, label }) => ({
                                            label,
                                            value: id,
                                        })),
                                        label: 'Origines',
                                        description: 'Ne rien cocher si l\'information est inconnue',
                                        mandatory: false,
                                        condition({ populationTotal }) {
                                            return parseInt(populationTotal, 10) > 10;
                                        },
                                        inactiveMessage: 'Pour les sites de 10 personnes ou moins, l\'origine des habitants ne peut être précisée conformément à la réglementation relative aux données à caractère personnel',
                                    },
                                },
                            },
                            {
                                title: 'Conditions de vie',
                                inputs: {
                                    electricityType: {
                                        type: 'radio',
                                        options: electricityTypes.map(({ id, label }) => ({
                                            label,
                                            value: id,
                                        })),
                                        label: 'Accès à l\'électricité',
                                        mandatory: true,
                                    },
                                    electricityComments: {
                                        type: 'textarea',
                                        label: 'Modalités d\'accès',
                                        description: 'Exemples : groupe électrogène, raccordement à une usine...',
                                        mandatory: false,
                                    },
                                    accessToWater: {
                                        type: 'radio',
                                        options: yesNoValues,
                                        label: 'Accès à l\'eau',
                                        mandatory: true,
                                    },
                                    waterComments: {
                                        type: 'textarea',
                                        label: 'Modalités d\'accès',
                                        description: 'Exemples: Citerne de 100 litres remplie par les pompiers tous les jours, 3 robinets raccordés par la collectivité, borne incendie à 200 mètres...',
                                        mandatory: false,
                                    },
                                    accessToSanitary: {
                                        type: 'radio',
                                        options: yesNoValues,
                                        label: 'Accès à des toilettes',
                                        mandatory: true,
                                    },
                                    sanitaryComments: {
                                        type: 'textarea',
                                        label: 'Modalités d\'accès',
                                        description: 'Exemples : 3 toilettes sèches, toilettes raccordés au réseau, un bloc sanitaire fourni par la ville...',
                                        mandatory: false,
                                    },
                                    trashEvacuation: {
                                        type: 'radio',
                                        options: yesNoValues,
                                        label: 'Évacuation des déchets',
                                        mandatory: true,
                                    },
                                },
                            },
                        ],
                        ...hasPermission('shantytown.create.data_justice')
                            ? [{
                                title: 'Procédure judiciaire d\'expulsion des occupants',
                                inputs: {
                                    ownerComplaint: {
                                        type: 'radio',
                                        options: yesNoValues,
                                        label: 'Dépôt de plainte par le propriétaire',
                                        mandatory: true,
                                    },
                                    justiceProcedure: {
                                        type: 'radio',
                                        options: yesNoValues,
                                        label: 'Existence d\'une procédure judiciaire',
                                        mandatory: true,
                                        condition({ ownerComplaint }) {
                                            return ownerComplaint === 1;
                                        },
                                    },
                                    justiceRendered: {
                                        type: 'radio',
                                        options: yesNoValues,
                                        label: 'Décision de justice rendue',
                                        mandatory: true,
                                        condition({ ownerComplaint, justiceProcedure }) {
                                            return ownerComplaint === 1
                                                && justiceProcedure === 1;
                                        },
                                    },
                                    justiceRenderedBy: {
                                        type: 'text',
                                        label: 'Origine de la décision',
                                        mandatory: true,
                                        condition({ ownerComplaint, justiceProcedure, justiceRendered }) {
                                            return ownerComplaint === 1
                                                && justiceProcedure === 1
                                                && justiceRendered === 1;
                                        },
                                    },
                                    justiceRenderedAt: {
                                        type: 'date',
                                        label: 'Date de la décision',
                                        mandatory: true,
                                        condition({ ownerComplaint, justiceProcedure, justiceRendered }) {
                                            return ownerComplaint === 1
                                                && justiceProcedure === 1
                                                && justiceRendered === 1;
                                        },
                                    },
                                    justiceChallenged: {
                                        type: 'radio',
                                        options: yesNoValues,
                                        label: 'Contentieux relatif à la décision de justice',
                                        mandatory: true,
                                        condition({ ownerComplaint, justiceProcedure, justiceRendered }) {
                                            return ownerComplaint === 1
                                                && justiceProcedure === 1
                                                && justiceRendered === 1;
                                        },
                                    },
                                    policeStatus: {
                                        type: 'radio',
                                        options: cfpValues,
                                        label: 'Concours de la force publique',
                                        mandatory: true,
                                    },
                                    policeRequestedAt: {
                                        type: 'date',
                                        label: 'Date de la demande du CFP',
                                        mandatory: true,
                                        condition({ policeStatus }) {
                                            return ['requested', 'granted'].indexOf(policeStatus) !== -1;
                                        },
                                    },
                                    policeGrantedAt: {
                                        type: 'date',
                                        label: 'Date d\'octroi du CFP',
                                        mandatory: true,
                                        condition({ policeStatus }) {
                                            return policeStatus === 'granted';
                                        },
                                    },
                                    bailiff: {
                                        type: 'text',
                                        label: 'Nom de l\'étude d\'huissiers',
                                        mandatory: false,
                                    },
                                },
                            }]
                            : [],

                    ],
                    wording: {
                        submit: 'Déclarer le site',
                        error: 'La déclaration du site a échoué',
                        success: 'La déclaration du site a réussi',
                    },
                    submit: (data) => {
                        const p = add(data);
                        p.then(({ plans }) => {
                            formDefinition.steps[1].sections[0].inputs.plans.options = plans.map(({ id, name, type }) => ({
                                label: name || type,
                                value: id,
                            }));
                        });
                        return p;
                    },
                },

                {
                    title: 'Dispositifs en cours sur le site',
                    sections: [
                        {
                            title: 'Sélection des dispositifs',
                            description: 'Des dispositifs sont déjà en place sur le territoire d\'implantation du site que vous venez de déclarer.',
                            inputs: {
                                plans: {
                                    type: 'checkbox',
                                    label: 'Dispositifs',
                                    description: 'Veuillez cocher, parmi ceux listés ci-dessous, les dispositifs déployés sur le site que vous venez de déclarer',
                                    mandatory: true,
                                    options: [],
                                },
                            },
                        },
                    ],
                    wording: {
                        submit: 'Valider les dispositfs',
                        error: 'L\'intégration du site aux dispositifs a échoué',
                        success: 'L\'intégration du site aux dispositifs a réussi',
                    },
                    submit: (data, [{ town: { id: townId } }]) => Promise.all(data.plans.map(planId => link(planId, townId))),
                },
            ],
        };

        return {
            data: {},
            formDefinition,
        };
    },

    methods: {
        onStepComplete(index, stepData) {
            if (index === 0) {
                if (!stepData.plans || stepData.plans.length === 0) {
                    this.$nextTick(() => {
                        this.$refs.form.goToNextStep(null);
                    });
                }
            }
        },
        onComplete(stepData, [{ town: { id } }]) {
            this.$router.push(`/site/${id}`);
        },
    },
};
