<template>
    <div>
        <UserValidateAccessStatusDate
            text="Demandé"
            :date="user.created_at"
            icon="flag"
            color="text-secondary"
            class="mb-2"
        />

        <div v-for="(userAccess, index) in oldUserAccesses" v-bind:key="index">
            <UserValidateAccessStatusDate
                text="Envoyé"
                :date="userAccess.created_at"
                icon="paper-plane"
                color="text-primary"
                class="mb-2"
            >
                <span v-if="userAccess.sent_by">
                    par {{ userAccess.sent_by.first_name }}
                    {{ userAccess.sent_by.last_name }}
                </span>
            </UserValidateAccessStatusDate>

            <UserValidateAccessStatusDate
                v-if="userAccess.isExpired"
                text="Expiré"
                :date="userAccess.expires_at"
                icon="unlink"
                color="text-G600"
                class="mb-2"
            />
        </div>

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
            v-if="hasExpired(0)"
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
        },
        hasExpired(userAccessIndex) {
            // last user access to date
            if (userAccessIndex === 0) {
                const now = Date.now();
                return (
                    this.user.status === "new" &&
                    this.user.user_accesses.length > 0 &&
                    now - this.user.user_accesses[0].expires_at * 1000 > 0
                );
            }

            // old user access: considered as expired only if it actually reached expiracy before
            // the sending of the next user access
            const expiredAt = this.user.user_accesses[userAccessIndex]
                .expires_at;
            const invalidatedAt = this.user.user_accesses[userAccessIndex - 1]
                .created_at;

            return expiredAt < invalidatedAt;
        }
    },
    computed: {
        oldUserAccesses() {
            return [...this.user.user_accesses]
                .map((userAccess, index) => ({
                    ...userAccess,
                    isExpired: this.hasExpired(index)
                }))
                .reverse()
                .slice(0, -1);
        }
    }
};
</script>
