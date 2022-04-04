<template>
    <div>
        <NavBar></NavBar>

        <section class="section section-white">
            <div class="container">
                <div v-if="error" class="notification error full-width">
                    <span
                        >{{ error }}.
                        <a href="#" @click="loadConfig">Réessayer ?</a></span
                    >
                </div>

                <FullBottomSection v-else :centered="true" class="text-primary">
                    <Spinner />
                    <span class="ml-4"
                        >Initialisation de la plateforme en cours...</span
                    >
                </FullBottomSection>
            </div>
        </section>
    </div>
</template>

<script>
import NavBar from "#app/layouts/Navbar/Navbar.vue";
import { getEntryPoint } from "#app/router";
import * as Sentry from "@sentry/vue";
import { setCustomVariables } from "#matomo/matomo";

export default {
    data() {
        return {
            error: null
        };
    },
    components: {
        NavBar
    },
    mounted() {
        this.loadConfig();
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
                    console.log("Error while loading", response);
                    this.error = response.user_message;
                })
                .then(() => {
                    this.redirect();
                });
        },
        redirect() {
            const { user } = this.$store.state.config.configuration;
            this.track(user);
            this.$router.push(getEntryPoint());
        },
        track(user) {
            Sentry.setUser({ id: user.id });
            setCustomVariables(this.$piwik, user);
        }
    }
};
</script>
