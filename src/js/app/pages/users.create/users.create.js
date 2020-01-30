import NavBar from '#app/layouts/navbar/navbar.vue';
import Form from '#app/components/form/form.vue';
import newUser from '#app/pages/signup/newUser';
import { create } from '#helpers/api/user';

const component = newUser({
    title: 'Créer un utilisateur',
    organizationTitle: 'Structure',
    organization: 'Quelle est la structure de l\'utilisateur ?',
    position: 'Fonction de l\'utilisateur',
    associationIsMissing: 'L\'association de l\'utilisateur n\'est pas dans cette liste',
    stepWording: {
        submit: 'Continuer',
        error: 'L\'utilisateur n\'a pas pu être créé',
        success: 'L\'utilisateur a bien été créé',
    },
}, create);

export default {

    components: {
        NavBar,
        Form,
    },

    data() {
        const data = component.data();
        data.isPopup = this.$route.query.association_name !== undefined;
        data.formDefinition.steps[0].sections.push({
            inputs: {
                legal: {
                    label: '',
                    mandatory: false,
                    type: 'checkbox',
                    options: [
                        { value: true, label: 'Je certifie que ces données personnelles ont été saisies avec l\'accord de leur propriétaire' },
                    ],
                },
            },
        });

        if (this.$route.query.association_name !== undefined) {
            data.formDefinition.steps[0].sections[1].inputs.organization_category.disabled = true;
            data.formDefinition.steps[0].sections[1].inputs.association.disabled = true;
            data.formDefinition.steps[0].sections[1].inputs.departement.disabled = true;
        }

        return data;
    },

    watch: Object.assign(component.watch, {
        state() {
            if (this.state === 'loaded' && this.$route.query.association_name !== undefined) {
                this.formData.organization_category = 'association';
                this.formData.association = this.$route.query.association_name;
                this.formData.departement = this.$route.query.association_departement;
            }
        },
    }),

    mounted() {
        this.load();
    },

    methods: Object.assign(component.methods, {
        /**
         * Alias to load(), for better readibility in the view
         *
         * @see load()
         */
        retryLoading() {
            this.load();
        },

        /**
         * On form's complete
         */
        onComplete(user) {
            if (this.isPopup) {
                window.opener.postMessage(user, '*');
                window.close();
                return;
            }

            this.$router.push(`/nouvel-utilisateur/${user.id}`);
        },
    }),

};
