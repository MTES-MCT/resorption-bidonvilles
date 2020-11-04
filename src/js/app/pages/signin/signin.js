import NavBar from "#app/layouts/navbar/navbar.vue";
import { login } from "#helpers/api/user";
import Form from "#app/components/form/form.vue";

export default {
    components: {
        NavBar,
        Form
    },
    data() {
        return {
            formData: {},
            formDefinition: {
                title: "Connexion à la plateforme",

                steps: [
                    {
                        sections: [
                            {
                                inputs: {
                                    email: {
                                        type: "text",
                                        label: "Votre courriel",
                                        mandatory: true
                                    },
                                    password: {
                                        type: "password",
                                        label: "Votre mot de passe",
                                        mandatory: true
                                    }
                                }
                            }
                        ],
                        wording: {
                            submit: "Me connecter",
                            succes: "Vous êtes désormais connecté",
                            error: "La tentative de connexion a échoué"
                        },
                        submitPrefix:
                            '<a href="/app.html#/nouveau-mot-de-passe">J\'ai perdu mon mot de passe</a>',
                        submit: ({ email, password }) => login(email, password)
                    }
                ]
            }
        };
    },
    methods: {
        onComplete() {
            window.localStorage.setItem("logged_once", true);
            this.$router.push({ path: "/" });
        }
    }
};
