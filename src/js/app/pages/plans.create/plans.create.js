import NavBar from '#app/layouts/navbar/navbar.vue';
import Form from '#app/components/form/form.vue';
import { get as getConfig } from '#helpers/api/config';
import { create } from '#helpers/api/plan';
import { getByCategory, getMembers, getMembersOfCategory } from '#helpers/api/organization';
import { notify } from '#helpers/notificationHelper';

export default {
    components: {
        NavBar,
        Form,
    },

    data() {
        const { user: me, topics } = getConfig();
        const data = {
            formData: {
                association: [],
            },
        };
        const that = this;
        const refs = this.$refs;

        data.formDefinition = {
            title: 'Déclarer un dispositif',
            descriptionTitle: 'Qu\'est-ce qu\'un dispositif ?',
            description: 'C’est une action mise en place et financée en partie ou en totalité par un acteur public. Sa finalité est la résorption des bidonvilles.<br/><strong>Qui doit le déclarer ?</strong> Le service de l\'Etat à l\'initiative du dispositif doit le déclarer. L\'acteur de terrain sera en charge de renseigner les informations relatives à l\'action menée.',
            steps: [
                {
                    title: 'Dispositf',
                    wording: {
                        error: 'La déclaration du dispositif a échoué',
                        submit: 'Déclarer le dispositif',
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
                                    condition({ locationType }) {
                                        return locationType === 'shantytowns';
                                    },
                                },
                                locationAddress: {
                                    type: 'addressWithLocation',
                                    label: 'Adresse du terrain d\'insertion',
                                    mandatory: true,
                                    condition({ locationType }) {
                                        return locationType === 'location';
                                    },
                                },
                                locationDetails: {
                                    type: 'text',
                                    label: 'Préciser',
                                    mandatory: true,
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
                                association: {
                                    type: 'autocompleter',
                                    label: 'Opérateur ou service en charge de l\'intervention',
                                    mandatory: true,
                                    specificProps: {
                                        autocompleter: (d) => {
                                            const p = getByCategory('association');
                                            const p2 = p.then(({ organizations }) => organizations
                                                .filter(({ name, abbreviation }) => d.split(' ').every(part => name.toLowerCase().indexOf(part.toLowerCase()) !== -1) || (abbreviation !== null && abbreviation.toLowerCase().indexOf(d.toLowerCase()) >= 0))
                                                .map(organization => ({
                                                    id: organization.id,
                                                    label: organization.name,
                                                    category: `${organization.departement_code} - ${organization.departement_name}`,
                                                })));
                                            p2.abort = p.abort;

                                            return p2;
                                        },
                                        showCategory: true,
                                        allowMultiple: false,
                                        float: true,
                                    },
                                },
                                contact: {
                                    type: 'select',
                                    label: 'Personne référente dans la structure',
                                    mandatory: true,
                                    options: [],
                                    condition({ association }) {
                                        return association !== undefined && association.length > 0 && this.options.length > 0;
                                    },
                                },
                                contact_missing: {
                                    type: 'hidden',
                                    label: 'Personne référente dans la structure',
                                    description: 'Aucune personne de cette structure n\'est encore enregistrée sur la plateforme résorption bidonville',
                                    mandatory: true,
                                    condition({ association }) {
                                        return association !== undefined
                                            && association.length > 0
                                            && refs.form.getInputById('contact').options.length === 0
                                            && that.loadingAssociationContacts === false;
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
                    submit: d => create(Object.assign({}, d, {
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

    methods: {
        onComplete() {
            notify({
                group: 'notifications',
                type: 'success',
                title: 'Dispositif correctement déclaré',
                text: 'Le dispositif a bien été ajouté en base de données',
            });

            this.$router.push('/liste-des-dispositifs');
        },
    },
};
