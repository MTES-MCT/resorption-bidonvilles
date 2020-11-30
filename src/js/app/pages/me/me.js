import NavBar from "#app/layouts/navbar/navbar.vue";
import Form from "#app/components/form/form.vue";
import { me, edit } from "#helpers/api/user";

export default {
    components: {
        NavBar,
        Form
    },
    data() {
        const formData = {
            first_name: "",
            last_name: "",
            password: ""
        };

        const formDefinition = {
            title: "Modifier vos données personnelles",
            description:
                "Vous pouvez compléter votre profil d'utilisateur et modifier votre mot de passe sur cette page.",
            steps: [
                {
                    title: "",
                    sections: [
                        {
                            title: "",
                            inputs: {
                                first_name: {
                                    label: "Votre prénom",
                                    mandatory: true,
                                    type: "text"
                                },
                                last_name: {
                                    label: "Votre nom de famille",
                                    mandatory: true,
                                    type: "text"
                                },
                                password: {
                                    label: "Mot de passe",
                                    description:
                                        "Laissez ce champ vide si vous souhaitez conserver votre mot de passe actuel.<br/><br/>Votre mot de passe doit comporter au minimum 12 caractères, une majuscule, une minuscule, et un caractère non alphabétique (exemples : '.' ';' ',' '_' '!' '?', ...)<br/>Nous vous recommandons de choisir <strong>une phrase intelligible en guise de mot de passe</strong> : plus simple à retenir qu'une suite de caractères aléatoires, et plus sécurisée.",
                                    mandatory: false,
                                    type: "password"
                                }
                            }
                        }
                    ],
                    wording: {
                        submit: "Modifier",
                        error: "Les modifications n'ont pas été appliquées",
                        success:
                            "Les modifications ont bien été prises en compte"
                    },
                    submit: edit
                }
            ]
        };

        return {
            preloading: true,
            preloadError: null,
            loading: false,

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
        this.preload();
    },

    methods: {
        preload() {
            this.preloadError = null;
            this.preloading = true;
            this.fetchData()
                .then(() => {
                    this.preloading = false;
                })
                .catch(error => {
                    this.preloadError = error.user_message;
                });
        },

        fetchData() {
            return me().then(data => {
                this.formData.first_name = data.first_name;
                this.formData.last_name = data.last_name;
                this.formData.password = "";
            });
        },

        /**
         *
         */
        onComplete() {
            this.preload();
        }
    }
};
