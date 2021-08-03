<template>
    <PrivateLayout>
        <PrivateContainer class="py-16">
            <div class="text-display-lg mb-8">Fiche utilisateur</div>
            <div v-if="user">
                <div class="flex">
                    <div class="w-1/3">
                        <UserValidateDetails :user="user" />
                        <div class="border border-G400 w-16 my-4"></div>
                        <UserValidateAccessStatus :user="user" />
                    </div>

                    <div class="ml-24 w-2/3">
                        <UserValidateRequestMessage
                            :user="user"
                            class="mb-4"
                            v-if="user.access_request_message"
                        />
                        <UserValidateAccessSettings
                            :user="user"
                            :permission="permission"
                            :checkedOptions.sync="checkedOptions"
                            :availableOptions="options"
                            class="mb-4"
                        />
                        <div class="bg-yellow-200 p-4 mb-4">
                            Ne jamais envoyer un accès si vous avez un doute sur
                            l’identité de la personne.
                        </div>
                    </div>
                </div>
                <div class="flex justify-end">
                    <Button
                        v-if="
                            loggedUser.role_id === 'national_admin' &&
                                user.role_id !== 'local_admin'
                        "
                        class="mr-4"
                        variant="primaryText"
                        @click="upgradeLocalAdmin"
                        >Définir comme « Administrateur local »</Button
                    >
                    <Button
                        v-if="user.status === 'active'"
                        class="mr-4"
                        variant="primary"
                        @click="remove"
                        >Désactiver l'accès</Button
                    >
                    <Button
                        v-if="
                            user.status === 'new' && user.user_access === null
                        "
                        class="mr-4"
                        variant="primary"
                        @click="deny"
                        >Refuser l'accès</Button
                    >
                    <Button
                        v-if="user.status === 'new'"
                        variant="tertiary"
                        icon="paper-plane"
                        iconPosition="left"
                        @click="validate"
                        >Envoyer un accès</Button
                    >
                </div>
            </div>

            <div v-else class="text-center text-primary text-display-lg mt-16">
                <Spinner />
            </div>
        </PrivateContainer>
    </PrivateLayout>
</template>

<script>
import PrivateLayout from "#app/components/PrivateLayout";
import PrivateContainer from "#app/components/PrivateLayout/PrivateContainer.vue";
import UserValidateDetails from "./UserValidateDetails/UserValidateDetails";
import UserValidateAccessStatus from "./UserValidateAccessStatus/UserValidateAccessStatus";
import UserValidateRequestMessage from "./UserValidateRequestMessage";
import UserValidateAccessSettings from "./UserValidateAccessSettings/UserValidateAccessSettings";
import { get as getConfig } from "#helpers/api/config";
import {
    denyAccess,
    get,
    remove,
    sendActivationLink,
    upgradeLocalAdmin
} from "#helpers/api/user";
import { notify } from "#helpers/notificationHelper";
import Spinner from "#app/components/ui/Spinner";

let permissions;

export default {
    components: {
        Spinner,
        PrivateLayout,
        PrivateContainer,
        UserValidateAccessStatus,
        UserValidateDetails,
        UserValidateRequestMessage,
        UserValidateAccessSettings
    },
    data() {
        const {
            permissions_description,
            activation_token_expires_in: activationTokenExpiresIn,
            user: loggedUser
        } = getConfig();
        permissions = permissions_description;

        return {
            loggedUser,

            /**
             * @type {User}
             */
            user: null,

            /**
             * The error's user message
             *
             * Obivously, null if there is no error
             *
             * @type {string|null}
             */
            error: null,

            /**
             * The current state of the page
             *
             * One out of: 'loading', 'error', or 'loaded'
             *
             * @type {string|null}
             */
            state: null,

            /**
             * Wether an activation link is being generated for one of the users
             *
             * @type {boolean}
             */
            loading: false,

            /**
             * Validation state
             *
             * @type {Object}
             */
            validation: {
                state: null,
                error: null
            },

            /**
             * List of checked options
             *
             * @type {Object.<String,Boolean>}
             */
            checkedOptions: {},

            /**
             * Number of days of validity of an activation days
             *
             * @type {Number}
             */
            tokenExpiresIn: activationTokenExpiresIn / 3600 / 24
        };
    },

    computed: {
        /**
         * Details about the permissions requested by the user
         *
         * @returns {Object}
         */
        permission() {
            if (!this.user) {
                return null;
            }

            return permissions[this.user.role_id];
        },

        /**
         * Get the allowed options for the current user
         *
         * @returns {Array}
         */
        options() {
            if (this.user === null || !this.permission) {
                return [];
            }

            return this.permission.options;
        }
    },

    created() {
        this.load();
    },

    methods: {
        formatDate(...args) {
            return App.formatDate.call(App, ...args);
        },

        /**
         * Tries fetching the data from the API
         *
         * Please note that this cannot be done if the data has already been loaded
         * before.
         */
        load() {
            // loading data is forbidden if the component is already loading or loaded
            if ([null, "error"].indexOf(this.state) === -1) {
                return;
            }

            this.state = "loading";
            this.error = null;

            get(this.$route.params.id)
                .then(user => {
                    this.user = user;
                    this.checkedOptions = user.permission_options;

                    this.state = "loaded";
                })
                .catch(({ user_message: error }) => {
                    this.error = error;
                    this.state = "error";
                });
        },

        /**
         * Alias to load(), for better readibility in the view
         *
         * @see load()
         */
        retryLoading() {
            this.load();
        },

        /**
         * Allows access to the user
         */
        validate() {
            if (this.validation.state === "loading") {
                return;
            }

            this.validation.state = "loading";
            this.validation.error = null;

            sendActivationLink(this.$route.params.id, {
                options: this.checkedOptions
            })
                .then(() => {
                    this.validation.state = null;

                    this.$trackMatomoEvent(
                        "Demande d'accès",
                        "Approuver accès"
                    );

                    notify({
                        group: "notifications",
                        type: "success",
                        title: "Accès envoyé",
                        text: "Un accès a été envoyé à l'utilisateur"
                    });

                    this.$router.push("/liste-des-utilisateurs");
                })
                .catch(({ user_message: error }) => {
                    this.validation.state = null;
                    this.validation.error = error;
                });
        },

        /**
         * Denies access to the user
         */
        deny() {
            if (this.validation.state === "loading") {
                return;
            }

            this.validation.state = "loading";
            this.validation.error = null;

            denyAccess(this.$route.params.id)
                .then(() => {
                    this.validation.state = null;

                    this.$trackMatomoEvent("Demande d'accès", "Refuser accès");
                    notify({
                        group: "notifications",
                        type: "success",
                        title: "Accès refusé",
                        text: "L'utilisateur a été supprimé de la base"
                    });

                    this.$router.push("/liste-des-utilisateurs");
                })
                .catch(({ user_message: error }) => {
                    this.validation.state = null;
                    this.validation.error = error;
                });
        },

        async upgradeLocalAdmin() {
            if (this.validation.state === "loading") {
                return;
            }

            // eslint-disable-next-line no-alert
            if (
                !window.confirm(
                    "Êtes-vous sûr de vouloir passer cet utilisateur administrateur local ?"
                )
            ) {
                return;
            }

            await upgradeLocalAdmin(this.$route.params.id);
            window.location.reload();
        },

        /**
         *
         */
        remove() {
            if (this.validation.state === "loading") {
                return;
            }

            // eslint-disable-next-line no-alert
            if (
                !window.confirm(
                    "Êtes-vous sûr de vouloir supprimer cet accès ?"
                )
            ) {
                return;
            }

            this.validation.state = "loading";
            this.validation.error = null;

            remove(this.$route.params.id)
                .then(() => {
                    this.validation.state = null;

                    notify({
                        group: "notifications",
                        type: "success",
                        title: "Accès supprimé",
                        text: "L'utilisateur a été supprimé de la base"
                    });

                    this.$router.push("/liste-des-utilisateurs");
                })
                .catch(({ user_message: error }) => {
                    this.validation.state = null;
                    this.validation.error = error;
                });
        }
    }
};
</script>
