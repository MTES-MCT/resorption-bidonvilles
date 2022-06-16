<template>
    <div>
        <NavBar></NavBar>

        <Container>
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
                    Initialisation de la plateforme en cours...
                </p>
            </FullBottomSection>
        </Container>
    </div>
</template>

<script>
import NavBar from "#app/layouts/Navbar/Navbar.vue";
import Container from "#app/components/PrivateLayout/PrivateContainer.vue";
import { getEntryPoint } from "#app/router";
import * as Sentry from "@sentry/vue";
import { setCustomVariables } from "#matomo/matomo";

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
    components: {
        NavBar,
        Container
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
        loadConfig() {
            if (this.$store.getters["config/loaded"] === true) {
                this.redirect();
                return;
            }

            this.error = null;
            this.$store
                .dispatch("config/load")
                .catch(response => {
                    this.error = response.user_message;
                })
                .then(() => {
                    this.redirect();
                });
        },
        redirect() {
            const { user } = this.$store.state.config.configuration;
            this.track(user);
            this.$router.push(getEntryPoint()).catch(() => {});
        },
        track(user) {
            Sentry.setUser({ id: user.id });
            setCustomVariables(this.$piwik, user);
        }
    }
};
</script>
