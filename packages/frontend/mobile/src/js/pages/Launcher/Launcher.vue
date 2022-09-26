<template>
    <div>
        <div v-if="error" class="notification error full-width">
            <span
                >{{ error }}.
                <a href="#" @click="loadConfig">Réessayer ?</a></span
            >
        </div>

        <FullBottomSection
            v-else-if="showLoadingBlock"
            :centered="true"
            class="text-primary flex flex-col"
        >
            <p class="text-display-xl"><Spinner /></p>
            <p :class="showLoadingText ? '' : 'text-white'">
                Initialisation de l'appli en cours...
            </p>
        </FullBottomSection>
    </div>
</template>

<script>
import { getEntryPoint } from "../../router";

export default {
    data() {
        return {
            error: null,
            blockLoaderTimeout: null,
            showLoadingBlock: false,
            textLoaderTimeout: null,
            showLoadingText: false
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

    beforeDestroy() {
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
                    response.user_message || "Une erreur inconnue est survenue";
            }
        },
        redirect() {
            this.$router.push(getEntryPoint()).catch(() => {});
        }
    }
};
</script>
