import { checkActivationToken, activate } from "#helpers/api/user";
import NavBar from "#app/layouts/navbar/navbar.vue";
import Form from "#app/components/form/form.vue";

export default {
    components: {
        NavBar,
        Form
    },

    data() {
        const formData = {
            email: ""
        };

        const formDefinition = {
            title: "Activation de votre compte utilisateur",
            descriptionTitle: "",
            description:
                "Vous vous apprêtez à activer votre compte utilisateur, veuillez choisir votre mot de passe de connexion.",
            steps: [
                {
                    title: "",
                    sections: [
                        {
                            title: "",
                            inputs: {
                                email: {
                                    label: "Votre email",
                                    mandatory: false,
                                    type: "text",
                                    disabled: true
                                },
                                password: {
                                    label: "Définissez votre mot de passe",
                                    description:
                                        "Votre mot de passe doit comporter au minimum 12 caractères, une majuscule, une minuscule, et un caractère non alphabétique (exemples : '.' ';' ',' '_' '!' '?', ...)<br/>Nous vous recommandons de choisir <strong>une phrase intelligible en guise de mot de passe</strong> : plus simple à retenir qu'une suite de caractères aléatoires, et plus sécurisée.",
                                    mandatory: true,
                                    type: "password"
                                }
                            }
                        }
                    ],
                    wording: {
                        submit: "Activer mon compte",
                        error: "Votre compte n'a pas pu être activé",
                        success:
                            "Vous pouvez désormais vous connecter à la plateforme"
                    },
                    submitPrefix:
                        'En cliquant sur "Activer mon compte", j\'accepte les <a href="/app.html/#/conditions-d-utilisation">conditions générales d\'utilisation</a> et de partager mes données (nom, prénom, courriel, structure et lorsque renseigné, numéro de téléphone) aux utilisateurs de la plateforme via l’annuaire',
                    submit: data =>
                        activate(
                            this.user.id,
                            Object.assign(data, {
                                token: this.$route.params.token
                            })
                        )
                }
            ]
        };

        return {
            state: null,
            error: null,
            user: null,

            /**
             * Form data
             */
            formData,

            /**
             * Form definition
             *
             * @type {Form},
             */
            formDefinition
        };
    },

    created() {
        this.load();
    },

    methods: {
        /**
         * Tries validating the activation token
         */
        load() {
            // loading data is forbidden if the component is already loading or loaded
            if ([null, "error"].indexOf(this.state) === -1) {
                return;
            }

            this.state = "loading";
            this.error = null;

            checkActivationToken(this.$route.params.token)
                .then(user => {
                    this.user = user;
                    this.formData.email = user.email;
                    this.state = "loaded";
                })
                .catch(({ user_message: error }) => {
                    this.error = error;
                    this.state = "error";
                });
        },

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
            this.$router.push("/");
        }
    }
};
