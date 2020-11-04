import NavBar from "#app/layouts/navbar/navbar.vue";
import Form from "#app/components/form/form.vue";
import { get as getConfig, load } from "#helpers/api/config";
import { upgrade } from "#helpers/api/user";

export default {
    components: {
        NavBar,
        Form
    },

    data() {
        const {
            user: { id: userId, email }
        } = getConfig();

        return {
            formData: {
                email
            },
            formDefinition: {
                title: "Résorption Bidonvilles a été mise à jour",
                description:
                    "La plateforme a été mise à jour en septembre 2019. A présent, il est possible pour les correspondants d'ouvrir des accès à un plus grand nombre d'acteurs.",

                steps: [
                    {
                        sections: [
                            {
                                title:
                                    "Pour compléter le futur annuaire, merci de renseigner les champs suivants",
                                inputs: {
                                    email: {
                                        type: "text",
                                        mandatory: false,
                                        label: "Votre email",
                                        disabled: true
                                    },
                                    position: {
                                        type: "text",
                                        mandatory: true,
                                        label: "Votre fonction"
                                    },
                                    phone: {
                                        type: "text",
                                        mandatory: false,
                                        label: "Votre numéro de téléphone",
                                        specificProps: {
                                            maxlength: 10
                                        }
                                    }
                                }
                            },
                            {
                                title:
                                    "Pour bénéficier de la mise à jour, merci de créer un nouveau mot de passe",
                                inputs: {
                                    password: {
                                        type: "password",
                                        mandatory: true,
                                        label:
                                            "Définissez votre nouveau mot de passe",
                                        description:
                                            "Votre mot de passe doit comporter au minimum 12 caractères, une majuscule, une minuscule, et un caractère non alphabétique (exemples : '.' ';' ',' '_' '!' '?', ...)<br/>Nous vous recommandons de choisir <strong>une phrase intelligible en guise de mot de passe</strong> : plus simple à retenir qu'une suite de caractères aléatoires, et plus sécurisée."
                                    }
                                }
                            }
                        ],
                        wording: {
                            submit: "Mettre à jour",
                            error: "Votre compte n'a pas pu être mis à jour",
                            success: "Votre compte a ben été mis à jour"
                        },
                        submit: data => upgrade(userId, data)
                    }
                ]
            }
        };
    },

    methods: {
        onComplete() {
            load()
                .then(() => {
                    this.$router.push({ path: "/" });
                })
                .catch(() => {
                    window.location.reload();
                });
        }
    }
};
