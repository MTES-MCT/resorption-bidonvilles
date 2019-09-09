import NavBar from '#app/layouts/navbar/navbar.vue';
import Form from '#app/components/form/form.vue';
import newUser from './newUser';
import { create } from '#helpers/api/user';

const component = newUser({
    title: 'Demander un accès à la plateforme Résorption bidonville',
    description: 'La demande sera envoyée à votre administrateur local.',
    organizationTitle: 'Votre structure',
    organization: 'Quelle est votre structure ?',
    position: 'Votre fonction',
    stepWording: {
        submit: 'Envoyer',
        error: 'Votre demande d\'accès n\'a pas pu être envoyée',
        success: 'Votre demande d\'accès a été envoyée',
    },
}, create);

export default {

    components: {
        NavBar,
        Form,
    },

    data() {
        const data = component.data();
        data.formDefinition.steps[0].sections.push(
            {
                title: 'Votre demande d\'accès',
                inputs: {
                    access_request_message: {
                        label: 'Merci de préciser quel usage de la plateforme vous souhaitez faire',
                        mandatory: true,
                        type: 'textarea',
                        specificProps: {
                            maxlength: 500,
                        },
                    },
                    legal: {
                        label: '',
                        mandatory: false,
                        type: 'checkbox',
                        options: [
                            { value: true, label: 'Je certifie que ces données personnelles ont été saisies avec mon accord' },
                        ],
                    },
                },
            },
        );

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
         *
         */
        onComplete() {
            this.$router.push('/');
        },
    }),

};
