<template>
    <div>
        <slot v-if="ready" />
        <div v-else class="flex justify-center items-center h-screen">
            <div class="text-center text-primary text-display-md">
                <Spinner />
            </div>
        </div>
    </div>
</template>

<script>
import {
    get as getConfig,
    hasPermission,
    isLoaded as isConfigLoaded,
    hasAcceptedCharte,
    load
} from "#helpers/api/config";
import { isLoggedIn, logout } from "#helpers/api/user";
import * as Sentry from "@sentry/vue";
import { setCustomVariables } from "#matomo/matomo";
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
    props: {
        ssr: {
            type: Boolean,
            default: false
        },
        beforeEnter: {
            type: [Object, String]
        }
    },
    data() {
        return {
            ready: !!this.$props.ssr,
            error: null
        };
    },
    async mounted() {
        if (this.beforeEnter?.action === "redirect") {
            this.$router.push(this.beforeEnter.to);
            return;
        }
        if (this.beforeEnter?.action === "open") {
            window.open(this.beforeEnter.to);
            this.$router.go(-1);
            return;
        }
        if (this.beforeEnter?.action === "signout") {
            logout(this.$piwik);
            this.$router.push("/");
            return;
        }
        const guards =
            (this.beforeEnter && guardGroups[this.beforeEnter]) || [];
        for (const guard of guards) {
            if (guard === "isLoggedIn" && !isLoggedIn()) {
                this.$router.push("/connexion");
            }
            if (guard === "isConfigLoaded" && !isConfigLoaded()) {
                await this.loadConfig();
            }
            if (guard === "isPermitted" && !this.isPermitted(this.$route)) {
                this.$router.push("/");
            }
            if (guard === "hasAcceptedCharte" && !hasAcceptedCharte()) {
                this.$router.push("/signature-charte-engagement");
            }
            if (guard === "isUpgraded" && !this.isUpgraded()) {
                this.$router.push("/mise-a-niveau");
            }
            if (
                guard === "hasNoPendingChangelog" &&
                this.hasPendingChangelog()
            ) {
                this.$router.push("/nouvelle-version");
            }
            if (guard === "home") {
                this.home();
            }
        }
        this.ready = true;
    },
    methods: {
        loadConfig() {
            if (isConfigLoaded() === true) {
                this.configLoaded = true;
                return;
            }
            this.error = null;
            return load()
                .then(user => {
                    Sentry.setUser({ id: user.id });
                    setCustomVariables(this.$piwik, user);
                })
                .catch(response => {
                    console.log("Error while loading", response);
                    this.error = response.user_message;
                });
        },
        /**
         * Checks whether the user has an unread changelog pending
         *
         * @returns {boolean}
         */
        hasPendingChangelog() {
            const { changelog } = getConfig();
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
            } = getConfig();
            return position !== "";
        },
        /**
         * Checks if the current user has all required permissions to access the given route
         *
         * @param {Route} to
         *
         * @returns {boolean}
         */
        isPermitted(to) {
            const { permissions } = to.meta;
            // if there is no permission needed, access is obviously granted
            if (!permissions) {
                return true;
            }
            // ensure all permissions are given
            return permissions.every(permission => hasPermission(permission));
        },
        home() {
            const to = this.$route;
            if (to.fullPath.substr(0, 2) === "/#") {
                return this.$router.push(to.fullPath.substr(2));
            }
            if (isLoggedIn()) {
                return this.$router.push("/cartographie");
            }
        }
    }
};
</script>
