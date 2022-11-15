<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <Layout :navbar="false">
        <template v-slot:scroll>
            <p v-if="error" class="mt-24 text-center">
                <span class="font-bold text-primary"
                    >Le chargement de l'application a échoué :</span
                ><br />
                <span>{{ error }}.</span><br />
                <Button
                    class="mt-6"
                    @click="loadConfig"
                    icon="arrow-alt-circle-right"
                    >Réessayer</Button
                >
            </p>
            <div
                v-else-if="showLoadingBlock"
                class="mt-24 text-primary text-center"
            >
                <p class="text-display-xl"><Spinner /></p>
                <p :class="showLoadingText ? 'font-bold' : 'text-white'">
                    Initialisation de l'application en cours...
                </p>
            </div>
        </template>
    </Layout>
</template>

<script>
import Layout from "#src/js/components/Layout.vue";
import { getEntryPoint } from "#src/js/router";
import { Button, Spinner } from "@resorptionbidonvilles/ui";

export default {
    components: {
        // eslint-disable-next-line vue/no-reserved-component-names
        Button,
        Layout,
        Spinner,
    },

    data() {
        return {
            error: null,
            blockLoaderTimeout: null,
            showLoadingBlock: false,
            textLoaderTimeout: null,
            showLoadingText: false,
        };
    },

    mounted() {
        this.loadConfig();
        this.blockLoaderTimeout = setTimeout(() => {
            this.showLoadingBlock = true;
        }, 1000);
        this.textLoaderTimeout = setTimeout(() => {
            this.showLoadingText = true;
        }, 3000);
    },

    beforeUnmount() {
        clearTimeout(this.blockLoaderTimeout);
        this.blockLoaderTimeout = null;
        clearTimeout(this.textLoaderTimeout);
        this.textLoaderTimeout = null;
    },
    methods: {
        async loadConfig() {
            if (this.$store.getters["config/loaded"] === true) {
                this.redirect();
                return;
            }

            this.error = null;
            try {
                await this.$store.dispatch("config/load");
                await this.$store.dispatch("notes/load");
                this.redirect();
            } catch (response) {
                this.error =
                    (response && response.user_message) ||
                    "Une erreur inconnue est survenue";
            }
        },
        redirect() {
            this.$router.push(getEntryPoint()).catch(() => {});
        },
    },
};
</script>
