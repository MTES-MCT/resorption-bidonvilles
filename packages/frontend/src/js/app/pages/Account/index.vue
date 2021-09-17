<template>
    <PrivateLayout class="mb-16">
        <LoadingError v-if="error">
            {{ error }}
        </LoadingError>
        <div v-else>
            <AccountRead v-if="!edit" :user="user" @openEdit="edit = true" />
            <AccountEdit v-else :user="user" @cancelEdit="edit = false" />
        </div>
    </PrivateLayout>
</template>

<script>
import PrivateLayout from "#app/components/PrivateLayout";
import LoadingError from "#app/components/PrivateLayout/LoadingError.vue";
import AccountRead from "./AccountRead/AccountRead";
import AccountEdit from "./AccountEdit/AccountEdit";
import { get as getConfig } from "#helpers/api/config";
import { get as getUser } from "#helpers/api/user";

export default {
    components: {
        PrivateLayout,
        LoadingError,
        AccountRead,
        AccountEdit
    },
    data() {
        return {
            user: null,
            edit: false,
            loading: false,
            error: null
        };
    },
    methods: {
        async load() {
            this.loading = true;
            this.error = null;
            this.edit = false;

            const { user: connectedUser } = getConfig();

            try {
                this.user = this.$route.params.id
                    ? await getUser(this.$route.params.id)
                    : connectedUser;

                if (!this.user) {
                    this.error =
                        "L'utilisateur n'existe pas en base de données.";
                }
            } catch (err) {
                this.error =
                    (err && err.user_message) ||
                    "Une erreur inconnue est survenue lors du chargement des données";
            }
            this.loading = false;
        }
    },
    mounted() {
        this.load();
    },
    // If user id changes, reload infos
    watch: {
        "$route.params.id"() {
            this.load();
        }
    }
};
</script>
