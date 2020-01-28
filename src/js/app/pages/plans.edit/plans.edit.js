import NavBar from '#app/layouts/navbar/navbar.vue';
import Form from '#app/components/form/form.vue';
import { get as getConfig } from '#helpers/api/config';
import { get, update } from '#helpers/api/plan';
import { getMembers, getMembersOfCategory } from '#helpers/api/organization';
import { notify } from '#helpers/notificationHelper';

export default {
    components: {
        NavBar,
        Form,
    },

    data() {
        const { user: me, topics } = getConfig();
        const data = {
            status: null,
            error: null,
            formData: {
                association: [],
            },
        };

        data.formDefinition = {
            title: 'Modifier un dispositif',
            descriptionTitle: 'Pourquoi modifier la fiche du dispositif ?',
            description: `Vous pouvez modifier ou mettre à jour les informations générales relatives au projet que vous pilotez.<br/>
            <br/>
            Deux informations pourront en particulier être mises à jour régulièrement :<br/>
            - les financements<br/>
            - les contacts référents<br/>
            <br/>
            A noter que les indicateurs de suivi du dispositif sont modifiés directement par la structure ou l’association en charge de l’intervention. Par exemple, le nombre de personnes dans le dispositif ou le nombre de ménages ayant accédé à un logement seront directement renseignés par ces derniers.`,
            steps: [
                {
                    title: 'Dispositif',
                    wording: {
                        error: 'La modification du dispositif a échoué',
                        submit: 'Modifier le dispositif',
                    },
                    sections: [
                        {
                            title: 'Intervention',
                            icon: 'list',
                            inputs: {
                                name: {
                                    type: 'text',
                                    label: 'Nom du dispositif',
                                    mandatory: true,
                                },
                                startedAt: {
                                    type: 'date',
                                    label: 'Date de début',
                                    mandatory: true,
                                },
                                expectedToEndAt: {
                                    type: 'date',
                                    label: 'Date de fin prévue (facultatif)',
                                    mandatory: false,
                                },
                                in_and_out: {
                                    type: 'radio',
                                    label: 'Ce dispositif implique-t-il un système d\'entrées et de sorties des personnes ?',
                                    mandatory: true,
                                    disabled: true,
                                    options: [
                                        { value: 1, label: 'Oui' },
                                        { value: 0, label: 'Non' },
                                    ],
                                },
                                topics: {
                                    type: 'checkbox',
                                    label: 'Champs d\'intervention',
                                    description: 'Les thématiques sélectionnées définissent l\'action que vous menez et les indicateurs de suivi associés.',
                                    mandatory: true,
                                    disabled: true,
                                    options: topics.map(({ uid, name }) => ({
                                        value: uid,
                                        label: name,
                                    })),
                                },
                                goals: {
                                    type: 'textarea',
                                    label: 'Objectifs',
                                    mandatory: true,
                                    specificProps: {
                                        placeholder: 'Précisez les objectifs, les enjeux, le contexte du dispositif\n\nPar exemple : résorber le bidonville, scolariser 80% des enfants identités en bidonvilles...',
                                    },
                                },
                            },
                        },
                        {
                            title: 'Lieu',
                            icon: 'map-pin',
                            inputs: {
                                locationType: {
                                    type: 'radio',
                                    label: 'L\'action se déroule dans le cadre suivant',
                                    mandatory: true,
                                    disabled: true,
                                    options: [
                                        { value: 'shantytowns', label: 'sur site(s) : bidonville ou squat' },
                                        { value: 'location', label: 'sur terrain d\'insertion' },
                                        { value: 'housing', label: 'dans le logement' },
                                        { value: 'other', label: 'dans plusieurs lieux' },
                                    ],
                                },
                                locationShantytowns: {
                                    type: 'townList',
                                    label: 'Sites concernés',
                                    mandatory: true,
                                    disabled: true,
                                    condition({ locationType }) {
                                        return locationType === 'shantytowns';
                                    },
                                },
                                locationAddress: {
                                    type: 'addressWithLocation',
                                    label: 'Adresse du terrain d\'insertion',
                                    mandatory: true,
                                    disabled: true,
                                    condition({ locationType }) {
                                        return locationType === 'location';
                                    },
                                },
                                locationDetails: {
                                    type: 'text',
                                    label: 'Préciser',
                                    mandatory: true,
                                    disabled: true,
                                    condition({ locationType }) {
                                        return locationType === 'other';
                                    },
                                },
                            },
                        },
                        {
                            title: 'Contacts',
                            inputs: {
                                government: {
                                    type: 'autocompleter',
                                    label: 'Personne au service de l\'état en charge du pilotage',
                                    mandatory: true,
                                    specificProps: {
                                        autocompleter: (d) => {
                                            const p = getMembersOfCategory('public_establishment');
                                            const p2 = p.then(({ users }) => users
                                                .filter(({ first_name: firstName, last_name: lastName }) => [firstName, lastName].some(value => d.split(' ').every(part => value.toLowerCase().indexOf(part.toLowerCase()) !== -1)))
                                                .map(({ id, first_name: firstName, last_name: lastName }) => ({
                                                    id,
                                                    label: `${firstName} ${lastName.toUpperCase()}`,
                                                })));
                                            p2.abort = p.abort;

                                            return p2;
                                        },
                                        showCategory: false,
                                        allowMultiple: false,
                                        float: true,
                                    },
                                },
                            },
                        },
                        {
                            title: 'Financements',
                            inputs: {
                                finances: {
                                    type: 'planFunding',
                                    label: '',
                                    mandatory: false,
                                },
                            },
                        },
                    ],
                    submit: d => update(this.$route.params.id, Object.assign({}, d, {
                        departement: me.organization.location.departement ? me.organization.location.departement.code : null,
                    })),
                },
            ],
        };

        if (me.organization.category.uid === 'public_establishment') {
            data.formData.state = [{
                id: me.id,
                label: `${me.first_name} ${me.last_name.toUpperCase()}`,
            }];
        }

        return data;
    },

    watch: {
        'formData.association': function organizationType() {
            if (!this.$refs.form) {
                return;
            }

            this.loadingAssociationContacts = true;
            this.$refs.form.getInputById('contact').options = [];

            if (this.formData.association.length === 0) {
                return;
            }

            getMembers(this.formData.association[0].id)
                .then(({ users }) => {
                    this.$refs.form.getInputById('contact').options = users.map(({ id, first_name: firstName, last_name: lastName }) => ({
                        value: id,
                        label: `${firstName} ${lastName.toUpperCase()}`,
                    }));
                    this.loadingAssociationContacts = false;
                });
        },
    },

    created() {
        this.load();
    },

    methods: {
        load() {
            if (['loading', 'loaded'].indexOf(this.status) !== -1) {
                return;
            }

            this.status = 'loading';
            this.error = null;
            get(this.$route.params.id)
                .then((plan) => {
                    this.formDefinition.title = `Modifier un dispositif - ${plan.name}`;
                    this.formData.name = plan.name;
                    this.formData.startedAt = plan.started_at;
                    this.formData.expectedToEndAt = plan.expected_to_end_at;
                    this.formData.in_and_out = plan.in_and_out ? 1 : 0;
                    this.formData.topics = plan.topics.map(({ uid }) => uid);
                    this.formData.goals = plan.goals;
                    this.formData.locationType = plan.location_type.id;
                    // this.formData.locationShantytowns = '';
                    // this.formData.locationAddress = '';
                    this.formData.locationDetails = plan.location_details;
                    this.formData.government = [{
                        id: plan.government_contacts[0].id,
                        label: `${plan.government_contacts[0].first_name} ${plan.government_contacts[0].last_name.toUpperCase()}`,
                    }];
                    this.formData.association = [{
                        id: plan.operator_contacts[0].organization.id,
                        label: plan.operator_contacts[0].organization.name,
                    }];
                    this.formData.contact = plan.operator_contacts[0].id;
                    this.formData.finances = plan.finances.map(({ year, data }) => ({
                        year,
                        data: data.map(({ type: { uid }, amount, details }) => ({
                            type: uid,
                            amount,
                            details,
                        })),
                    }));

                    this.plan = plan;
                    this.status = 'loaded';
                })
                .catch((error) => {
                    this.error = error.user_message;
                    this.status = 'loadingError';
                });
        },
        onComplete() {
            notify({
                group: 'notifications',
                type: 'success',
                title: 'Dispositif modifié',
                text: 'Le dispositif a bien été mis à jour',
            });

            this.$router.push('/liste-des-dispositifs');
        },
    },
};
