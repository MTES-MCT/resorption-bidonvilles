import {
    categories as getOrgCategories,
    types as getOrgTypes,
    getByType as getOrganizationsByType,
    getByCategory as getOrganizationsByCategory,
} from '#helpers/api/organization';
import { departements as listDepartements } from '#helpers/addressHelper';

/**
 * @typedef {Object} NewUserWording
 * @property {String} title
 * @property {String} description
 * @property {Object} stepWording
 * @property {String} organization Label of the input organization_category
 */

/**
 * @param {NewUserWording} wording
 * @param {Function}       submitFn
 */
export default (wording, submitFn) => ({

    data() {
        const formData = {};
        const formDefinition = {
            title: wording.title,
            description: wording.description,
            steps: [
                {
                    wording: wording.stepWording,
                    sections: [
                        {
                            title: 'Informations personnelles',
                            inputs: {
                                last_name: {
                                    label: 'NOM',
                                    mandatory: true,
                                    type: 'text',
                                },
                                first_name: {
                                    label: 'Prénom',
                                    mandatory: true,
                                    type: 'text',
                                },
                                email: {
                                    label: 'Courriel',
                                    mandatory: true,
                                    type: 'text',
                                },
                            },
                        },
                        {
                            title: 'Votre structure',
                            inputs: {
                                organization_category: {
                                    label: wording.organization,
                                    mandatory: true,
                                    type: 'radio',
                                    options: [],
                                },
                                organization_type: {
                                    label: 'Précisez le type de structure',
                                    mandatory: true,
                                    type: 'select',
                                    options: [],
                                    condition({ organization_category: category }) {
                                        return category === 'public_establishment';
                                    },
                                },
                                organization_public: {
                                    label: 'Territoire de rattachement',
                                    mandatory: true,
                                    type: 'select',
                                    options: [],
                                    condition: ({ organization_category: category, organization_type: type }) => category === 'public_establishment' && type !== undefined,
                                },
                                territorial_collectivity: {
                                    label: 'Nom de la structure',
                                    mandatory: true,
                                    type: 'collectivity',
                                    condition({ organization_category: category }) {
                                        return category === 'territorial_collectivity';
                                    },
                                },
                                association: {
                                    label: 'Nom de la structure',
                                    mandatory: true,
                                    type: 'autocompleter',
                                    specificProps: {
                                        autocompleter: (str) => {
                                            const p1 = getOrganizationsByCategory('association', str);
                                            const p2 = p1.then(({ organizations }) => {
                                                const usedLabels = [];

                                                return organizations
                                                    .map(({ id, name }) => ({
                                                        id,
                                                        value: id,
                                                        label: name,
                                                        category: null,
                                                        data: {},
                                                    }))
                                                    .filter((item) => {
                                                        if (usedLabels.includes(item.label)) {
                                                            return false;
                                                        }

                                                        usedLabels.push(item.label);
                                                        return true;
                                                    });
                                            });
                                            p2.abort = p1.abort;
                                            return p2;
                                        },
                                        showCategory: false,
                                        allowMultiple: false,
                                        float: true,
                                        createNew: (data) => {
                                            formData.association = [{
                                                value: data,
                                                label: data,
                                                category: null,
                                            }];
                                        },
                                    },
                                    condition({ organization_category: category }) {
                                        return category === 'association';
                                    },
                                },
                                departement: {
                                    label: 'Territoire de rattachement',
                                    mandatory: true,
                                    type: 'select',
                                    options: [],
                                    condition({ organization_category: category }) {
                                        return category === 'association';
                                    },
                                },
                                organization_administration: {
                                    label: 'Nom de la structure',
                                    mandatory: true,
                                    type: 'select',
                                    options: [],
                                    condition({ organization_category: category }) {
                                        return category === 'administration';
                                    },
                                },
                                position: {
                                    label: 'Votre fonction',
                                    mandatory: true,
                                    type: 'text',
                                    condition({ organization_category: category }) {
                                        return category !== undefined;
                                    },
                                },
                            },
                        },
                    ],
                    submit: (data) => {
                        let association;
                        if (data.association !== undefined) {
                            if (data.association && data.association.length === 1) {
                                [association] = data.association;
                            } else {
                                association = null;
                            }
                        }

                        return submitFn(Object.assign({}, data, {
                            legal: data.legal && data.legal.length === 1 && data.legal[0] === true,
                            association,
                        }));
                    },
                },
            ],
        };

        return {
            /**
             * The current state of the page
             *
             * One out of: 'loading', 'error', or 'loaded'
             *
             * @type {string|null}
             */
            state: null,

            /**
             * @type {string|null}
             */
            loadingError: null,

            /**
             * Form data
             */
            formData,

            /**
             * Form definition
             */
            formDefinition,
        };
    },

    watch: {
        'formData.organization_type': function organizationType() {
            this.$refs.form.getInputById('organization_public').options = [];

            getOrganizationsByType(this.formData.organization_type)
                .then(({ organizations }) => {
                    this.$refs.form.getInputById('organization_public').options = organizations.map((organization) => {
                        const level = organization.location_type;
                        let label = organization[`${level}_name`];

                        if (level === 'nation') {
                            label = 'France';
                        } else if (level === 'departement') {
                            label = `${organization[`${level}_code`]} - ${organization[`${level}_name`]}`;
                        }

                        return {
                            value: organization.id,
                            label,
                        };
                    });
                    this.formData.organization_public = undefined;
                });
        },
    },

    methods: {
        /**
         * Tries fetching the data from the API
         *
         * Please note that this cannot be done if the data has already been loaded
         * before.
         */
        load() {
            // loading data is forbidden if the component is already loading or loaded
            if ([null, 'error'].indexOf(this.state) === -1) {
                return;
            }

            this.state = 'loading';
            this.loadingError = null;

            Promise.all([
                getOrgCategories(),
                getOrgTypes('public_establishment'),
                getOrganizationsByCategory('administration'),
                listDepartements(),
            ])
                .then(([{ categories }, { types }, { organizations }, { departements }]) => {
                    this.formDefinition.steps[0].sections[1].inputs.organization_category.options = categories.map(({ uid, name_singular: name }) => ({
                        value: uid,
                        label: name,
                    }));
                    this.formDefinition.steps[0].sections[1].inputs.organization_type.options = types
                        .filter(({ numberOfOrganizations }) => numberOfOrganizations > 0)
                        .filter(({ name_singular: name }) => name !== 'Gendarmerie nationale')
                        .map(({ id, name_singular: name, abbreviation }) => ({
                            value: id,
                            label: abbreviation || name,
                        }));
                    this.formDefinition.steps[0].sections[1].inputs.organization_administration.options = organizations.map(({ id, name }) => ({
                        value: id,
                        label: name,
                    }));
                    this.formDefinition.steps[0].sections[1].inputs.departement.options = departements.map(({ code, name }) => ({
                        value: code,
                        label: `${code} - ${name}`,
                    }));
                    this.state = 'loaded';
                })
                .catch(({ user_message: error }) => {
                    this.loadingError = error;
                    this.state = 'error';
                });
        },
    },

});
