<template>
    <div class="object-center">
        <div class="v1 print:hidden">
            <NavBar />
        </div>
        <slot />
        <div class="object-center max-w-3xl mx-auto mx-">
            <img
                src="./assets/A_mini_bidon.png"
                class="mx-auto my-8 max-w-sm"
            />
            <h1 class="text-display-lg text-center mb-8">
                Agir pour la résorption des bidonvilles
            </h1>

            <p class="mb-4">
                <em>Résorption-bidonvilles</em> a pour vocation d'<strong
                    >accélérer la politique de résorption des
                    bidonvilles</strong
                >
                telle que décrite par
                <a
                    class="link"
                    href="https://www.legifrance.gouv.fr/download/pdf/circ?id=42949"
                    target="_blank"
                >
                    l'instruction du 25 janvier 2018 </a
                >. Il s'agit pour cela de dépasser l'approche centrée sur les
                évacuations au profit d'une
                <strong>
                    approche globale alliant insertion sociale, respect de
                    l'ordre public et prévention des réinstallations.
                </strong>
            </p>

            <p class="mb-4">
                <strong>
                    Les données partagées sur la plateforme doivent être
                    utilisées uniquement pour servir cet objectif de résorption, </strong
                >, ne doivent pas être nominatives ni faire référence à
                l'origine ethnique ou culturelle des personnes et doivent
                respecter la dignité des habitants des bidonvilles.
            </p>

            <p>
                <strong>La plateforme est un outil collaboratif</strong> où
                chaque utilisateur, à sa place, s'engage à contribuer, à être
                actif.
            </p>

            <div class="my-4">
                <a class="link" :href="charte.fichier" target="_blank">
                    Charte d'engagement détaillée
                </a>
            </div>
            <div class="bg-yellow-200 flex flex-row p-5 mb-8">
                <div>
                    <Checkbox
                        :checkValue="true"
                        v-model="charte_agreement"
                        :disabled="form.status === 'pending'"
                    />
                </div>
                <div>
                    En validant mon accès,
                    <strong
                        >je m’engage à contribuer et à utiliser la plateforme
                        dans une optique de résorption des bidonvilles selon
                        l'approche humaine et pragmatique décrite par
                        <a
                            class="link"
                            href="https://www.legifrance.gouv.fr/download/pdf/circ?id=42949"
                            target="_blank"
                        >
                            l'instruction du 25 janvier 2018
                        </a>
                    </strong>
                    .
                </div>
            </div>

            <div class="bg-yellow-200 flex flex-row p-5 mb-8">
                <div>
                    <Checkbox
                        :checkValue="true"
                        v-model="confidentiality_agreement"
                        :disabled="form.status === 'pending'"
                    />
                </div>
                <div>
                    Je m'engage à
                    <strong>
                        respecter la charte d'engagement, à exploiter les
                        informations présentes sur la plateforme exclusivement
                        pour les besoins propres de mon organisation ; à ne pas
                        communiquer
                    </strong>
                    sous aucune forme (orale, écrite, copie) à un tiers.
                </div>
            </div>

            <div class="my-8" v-if="form.status === 'error'">
                <span class="font-bold">Une erreur est survenue :</span><br />
                <span>{{ form.error }}</span>
            </div>

            <div class="flex flex-row space-x-16">
                <Button
                    class="mb-4 flex flex-none"
                    variant="primaryText"
                    @click="cancel"
                >
                    Annuler
                </Button>
                <div class="flex flex-col">
                    <div>
                        <Button
                            class="mb-4"
                            variant="primary"
                            :disabled="
                                form.status === 'pending' ||
                                    !charte_agreement.includes(true) ||
                                    !confidentiality_agreement.includes(true)
                            "
                            :loading="loading"
                            @click="submit"
                        >
                            Oui, je valide mon accès
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { get as getConfig, set as setConfig } from "#helpers/api/config";
import { acceptCharte } from "#helpers/api/user";
import NavBar from "#app/layouts/navbar/navbar.vue";

export default {
    components: {
        NavBar
    },

    data() {
        const {
            user: { id: userId },
            version_charte_engagement: charte
        } = getConfig();

        return {
            user: userId,
            charte,
            charte_agreement: [],
            confidentiality_agreement: [],
            form: {
                status: null,
                error: null
            },
            loading: false,
            checkboxValue: []
        };
    },

    methods: {
        submit() {
            if (this.form.status === "pending") {
                return;
            }

            this.loading = true;
            this.form.status = "pending";
            this.form.error = null;

            acceptCharte(
                this.user,
                this.charte.version,
                this.charte_agreement[0],
                this.confidentiality_agreement[0]
            )
                .then(() => {
                    setConfig("user.charte_engagement_a_jour", true);
                    this.loading = false;
                    this.$router.push("/");
                })
                .catch(({ user_message: message }) => {
                    this.loading = false;
                    this.form.status = "error";
                    this.form.error = message;
                });
        },
        cancel() {
            this.$router.push("/deconnexion");
        }
    }
};
</script>
