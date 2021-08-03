<template>
    <div>
        <UserValidateAccessStatusDate
            text="Demandé"
            :date="user.created_at"
            icon="flag"
            color="text-secondary"
        />

        <UserValidateAccessStatusDate
            v-if="isExpired"
            text="Expiré"
            :date="user.user_access.expires_at"
            icon="unlink"
            color="text-G400"
        />

        <UserValidateAccessStatusDate
            v-if="user.user_access && user.user_access.created_at"
            text="Envoyé"
            :date="user.user_access.created_at"
            icon="paper-plane"
            color="text-primary"
        >
            <span v-if="user.user_access.sent_by">
                Par {{ user.user_access.sent_by.first_name }}
                {{ user.user_access.sent_by.last_name }}
            </span>
        </UserValidateAccessStatusDate>

        <UserValidateAccessStatusDate
            v-if="user.user_access && user.user_access.used_at"
            text="Activé"
            :date="user.user_access.used_at"
            icon="user-check"
            color="text-tertiary"
        >
            <span v-if="user.user_access.sent_by">
                Par {{ user.user_access.sent_by.first_name }}
                {{ user.user_access.sent_by.last_name }}
            </span>
        </UserValidateAccessStatusDate>

        <div class="mb-4 text-center font-bold" v-if="user.last_access">
            Dernière connexion le {{ formatDate(user.last_access, "d M y") }}
        </div>
    </div>
</template>

<script>
import UserValidateAccessStatusDate from "#app/pages/UserValidate/UserValidateAccessStatus/UserValidateAccessStatusDate";
export default {
    components: { UserValidateAccessStatusDate },
    props: {
        user: {
            type: Object
        }
    },
    methods: {
        formatDate(...args) {
            return App.formatDate.call(App, ...args);
        }
    },
    computed: {
        /**
         * Indicates whether the activation link is now expired
         *
         * @returns {Boolean}
         */
        isExpired() {
            const now = Date.now();
            return (
                this.user !== null &&
                this.user.status !== "active" &&
                this.user.user_access !== null &&
                now - this.user.user_access.expires_at * 1000 > 0
            );
        }
    }
};
</script>
