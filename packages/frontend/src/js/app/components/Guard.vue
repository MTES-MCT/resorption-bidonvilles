<template>
    <div>
        <slot v-if="ready" />
        <PrivateLayout v-else-if="error">
            <LoadingError>
                {{ error }}
            </LoadingError>
        </PrivateLayout>
        <div v-else class="flex justify-center items-center h-screen">
            <div class="text-center text-primary text-display-md">
                <Spinner />
            </div>
        </div>
    </div>
</template>

<script>
import { hasPermission } from "#helpers/api/config";
import * as Sentry from "@sentry/vue";
import { setCustomVariables } from "#matomo/matomo";
import PrivateLayout from "#app/components/PrivateLayout";
import LoadingError from "#app/components/PrivateLayout/LoadingError.vue";

const guardGroups = {
    anonymous: ["anonymous"],
    loggedIn: ["isLoggedIn"],
    loaded: ["isLoggedIn", "isConfigLoaded", "isPermitted"],
    loadedAndUpgraded: [
        "isLoggedIn",
        "isConfigLoaded",
        "isPermitted",
        "hasAcceptedCharte",
        "isUpgraded"
    ],
    loadedAndUpToDate: [
        "isLoggedIn",
        "isConfigLoaded",
        "isPermitted",
        "hasAcceptedCharte",
        "isUpgraded",
        "hasNoPendingChangelog"
    ],
    signatureCharte: [
        "isLoggedIn",
        "isConfigLoaded",
        "isPermitted",
        "hasAcceptedCharte"
    ],
    home: ["home"]
};

export default {
    components: {
        PrivateLayout,
        LoadingError
    },
    data() {
        return {
            ready: !!this.$route.meta?.ssr,
            error: null
        };
    },
    async mounted() {
        const beforeEnter = this.$route.meta.beforeEnter;

        if (beforeEnter?.action === "redirect") {
            this.$router.push(
                Object.keys(this.$route.params).reduce(
                    (path, key) =>
                        path.replaceAll(`:${key}`, this.$route.params[key]),
                    beforeEnter.to
                )
            );
            return;
        }

        if (beforeEnter?.action === "open") {
            window.open(beforeEnter.to);
            this.$router.go(-1);
            return;
        }

        if (beforeEnter?.action === "signout") {
            this.$store.dispatch("logout", this.$piwik);
            this.$router.push("/");
            return;
        }

        const guards = (beforeEnter && guardGroups[beforeEnter]) || [];
        for (const guard of guards) {
            if (guard === "isLoggedIn" && !this.$store.getters.loggedIn) {
                this.$store.commit("setEntrypoint", this.$route.path);
                return this.$router.push("/connexion?r=1");
            }

            if (guard === "isConfigLoaded" && !this.$store.getters.loaded) {
                try {
                    await this.loadConfig();
                } catch (response) {
                    this.error =
                        response?.user_message || "Une erreur est survenue.";
                    return;
                }
            }
            if (guard === "isPermitted" && !this.isPermitted()) {
                return this.$router.push("/");
            }
            if (
                guard === "hasAcceptedCharte" &&
                !this.$store.getters.hasAcceptedCharte
            ) {
                this.$store.commit("setEntrypoint", this.$route.path);
                return this.$router.push("/signature-charte-engagement");
            }
            if (guard === "isUpgraded" && !this.isUpgraded()) {
                return this.$router.push("/mise-a-niveau");
            }
            if (
                guard === "hasNoPendingChangelog" &&
                this.hasPendingChangelog()
            ) {
                this.$store.commit("setEntrypoint", this.$route.path);
                return this.$router.push("/nouvelle-version");
            }
            if (guard === "home") {
                this.home();
                return;
            }
        }

        this.ready = true;
    },

    methods: {
        async loadConfig() {
            if (this.$store.getters.loaded === true) {
                return;
            }
            this.error = null;
            const { user } = await this.$store.dispatch("loadConfig");
            try {
                Sentry.setUser({ id: user.id });
                setCustomVariables(this.$piwik, user);
            } catch (err) {
                console.log("Failed to init sentry or matomo", err);
            }
        },
        /**
         * Checks whether the user has an unread changelog pending
         *
         * @returns {boolean}
         */
        hasPendingChangelog() {
            const { changelog } = this.$store.state.config.configuration;
            return changelog && changelog.length > 0;
        },
        /**
         * Checks whether the current user has to upgrade his account before accessing any other page
         *
         * @returns {boolean}
         */
        isUpgraded() {
            const {
                user: { position }
            } = this.$store.state.config.configuration;
            return position !== "";
        },
        /**
         * Checks if the current user has all required permissions to access the given route
         *
         * @returns {boolean}
         */
        isPermitted() {
            const { permissions } = this.$route.meta;
            // if there is no permission needed, access is obviously granted
            if (!permissions) {
                return true;
            }
            // ensure all permissions are given
            return permissions.every(permission => hasPermission(permission));
        },
        home() {
            if (this.$store.getters.loggedIn) {
                const { entrypoint } = this.$store.state;
                if (entrypoint !== null) {
                    this.$store.commit("setEntrypoint", null);
                    return this.$router.push(entrypoint);
                }

                return this.$router.push("/tableau-de-bord");
            }
        }
    }
};
</script>
