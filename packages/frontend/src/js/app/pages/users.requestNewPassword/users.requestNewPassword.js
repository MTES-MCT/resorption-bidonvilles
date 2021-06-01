import NavBar from "#app/layouts/navbar/navbar.vue";
import { requestNewPassword } from "#helpers/api/user";
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
                title: "Renouvellement de mot de passe",
                description:
                    "Si vous avez perdu votre mot de passe, vous pouvez demander à en définir un nouveau.",

                steps: [
                    {
                        sections: [
                            {
                                inputs: {
                                    email: {
                                        type: "text",
                                        label: "Votre courriel",
                                        description:
                                            "Saisissez ici le courriel associé au compte Résorption Bidonvilles pour lequel vous souhaitez renouveler le mot de passe",
                                        mandatory: true
                                    }
                                }
                            }
                        ],
                        wording: {
                            submit: "Renouveller mon mot de passe",
                            success:
                                "Un mail vous a été adressé avec les instructions",
                            error: "La demande de renouvellement a échoué"
                        },
                        submit: ({ email }) => requestNewPassword(email)
                    }
                ]
            }
        };
    },
    methods: {
        onComplete() {
            this.$router.push({ path: "/" });
        }
    }
};
