<template>
    <div>
        <UserValidateAccessStatusDate
            text="Demandé"
            :date="user.created_at"
            icon="flag"
            color="text-secondary"
            class="mb-2"
        />

        <UserValidateAccessStatusDate
            v-if="user.user_accesses.length > 0"
            text="Envoyé"
            :date="user.user_accesses[0].created_at"
            icon="paper-plane"
            color="text-primary"
            class="mb-2"
        >
            <span v-if="user.user_accesses[0].sent_by">
                par {{ user.user_accesses[0].sent_by.first_name }}
                {{ user.user_accesses[0].sent_by.last_name }}
            </span>
        </UserValidateAccessStatusDate>

        <UserValidateAccessStatusDate
            v-if="isExpired"
            text="Expiré"
            :date="user.user_accesses[0].expires_at"
            icon="unlink"
            color="text-G600"
            class="mb-2"
        />

        <UserValidateAccessStatusDate
            v-if="
                user.user_accesses.length > 0 && user.user_accesses[0].used_at
            "
            text="Activé"
            :date="user.user_accesses[0].used_at"
            icon="user-check"
            color="text-tertiary"
            class="mb-2"
        >
            <span v-if="user.user_accesses[0].sent_by">
                par {{ user.user_accesses[0].sent_by.first_name }}
                {{ user.user_accesses[0].sent_by.last_name }}
            </span>
        </UserValidateAccessStatusDate>

        <UserValidateAccessStatusDate
            v-if="user.last_access && loggedUser.role_id === 'national_admin'"
            text="Dernière connexion"
            :date="user.last_access"
            icon="chalkboard-teacher"
            color="text-g600"
            class="mb-2"
        />
    </div>
</template>

<script>
import UserValidateAccessStatusDate from "./UserValidateAccessStatusDate";
export default {
    components: { UserValidateAccessStatusDate },
    props: {
        user: {
            type: Object
        },
        loggedUser: {
            type: Object
        }
    },
    methods: {
        formatDate(...args) {
            return App.formatDate.call(App, ...args).toLowerCase();
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
                this.user.user_accesses.length > 0 &&
                now - this.user.user_accesses[0].expires_at * 1000 > 0
            );
        }
    }
};
</script>
