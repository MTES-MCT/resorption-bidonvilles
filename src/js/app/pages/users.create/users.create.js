import NavBar from '#app/layouts/navbar/navbar.vue';
import Form from '#app/components/form/form.vue';
import newUser from '#app/pages/signup/newUser';
import { create } from '#helpers/api/user';

const component = newUser({
    title: 'Créer un utilisateur',
    organization: 'Quelle est la structure ?',
    stepWording: {
        submit: 'Envoyer',
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
        return data;
    },

    watch: Object.assign(component.watch, {}),

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
        onComplete({ id: userId }) {
            this.$router.push(`/nouvel-utilisateur/${userId}`);
        },
    }),

};
