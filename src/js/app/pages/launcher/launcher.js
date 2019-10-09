import NavBar from '#app/layouts/navbar/navbar.vue';
import Changelog from '#app/components/changelog/changelog.vue';
import { isLoaded as isConfigLoaded, load } from '#helpers/api/config';
import { getEntryPoint } from '#app/router';

export default {
    data() {
        return {
            error: null,
            changelog: null,
        };
    },
    components: {
        NavBar,
        Changelog,
    },
    mounted() {
        this.loadConfig();
    },
    methods: {
        loadConfig() {
            if (isConfigLoaded() === true) {
                this.redirect();
                return;
            }

            this.error = null;
            this.changelog = null;
            load()
                .then(() => {
                    // eslint-disable-next-line no-constant-condition
                    if (true) {
                        this.changelog = {
                            items: [
                                {
                                    title: 'Mobiliser plus d’acteurs grâce aux accès différenciés',
                                    description: '<p>À chaque acteur, ses droits d’accès.</p><p>Tout acteur de la résorption des bidonvilles peut effectuer une demande d’accès. Désormais, l’administrateur local identifié parmi les correspondants valide et paramètre l\'accès du nouvel utilisateur.</p><p><a href="http://localhost:1234/#/typologie-des-acces" target="_blank">Guide des accès et de l\'administrateur</a></p>',
                                    image: 'https://placekitten.com/386/232',
                                },
                                {
                                    title: 'Voir rapidement la situation des sites sur un territoire',
                                    description: '<p><br/>Le tableau récapitulatif des sites a été optimisé pour mieux visualiser la situation. Vous pouvez le retrouver dans l’onglet site.</p>',
                                    image: 'https://placekitten.com/386/232',
                                },
                                {
                                    title: 'Exporter un tableau Excel lisible et exploitable',
                                    description: '<p><br/>Vous pouvez plus facilement exploiter les données grâce à l’optimisation de la fonctionnalité d’export des sites.</p><p><br/>Les sites fermés et ouverts ont été différenciés pour un suivi plus adapté. L’export s’effectue depuis la liste des sites.</p>',
                                    image: 'https://placekitten.com/386/232',
                                },
                                {
                                    title: 'Contacter les partenaires des actions de résorption des bidonvilles',
                                    description: '<p><br/>Un annuaire avec l’ensemble des utilisateurs est disponible depuis le menu principal.</p>',
                                    image: 'https://placekitten.com/386/232',
                                },
                            ],
                            date: 'octobre 2019',
                        };
                        return;
                    }

                    this.redirect();
                })
                .catch((response) => {
                    this.error = response.user_message;
                });
        },
        redirect() {
            this.$router.push(getEntryPoint());
        },
    },
};
