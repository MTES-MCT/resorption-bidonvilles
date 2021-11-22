<template>
    <PrivateLayout>
        <PrivateContainer class="py-8">
            <div v-if="!directoryLoading && organization">
                <OrganizationRead
                    v-if="!edit"
                    :organization="organization"
                    @openEdit="edit = true"
                />
                <OrganizationEdit
                    v-else
                    :organization="organization"
                    @cancelEdit="edit = false"
                />
            </div>
            <LoadingError v-else-if="!directoryLoading && !organization">
                La structure demandée n'existe pas en base de données ou n'a pas
                d'utilisateurs actifs
            </LoadingError>
            <LoadingPage
                v-else-if="(directoryLoading && !organization) || loading"
            />
        </PrivateContainer>
    </PrivateLayout>
</template>
<script>
import PrivateLayout from "#app/components/PrivateLayout";
import PrivateContainer from "#app/components/PrivateLayout/PrivateContainer";
import LoadingError from "#app/components/PrivateLayout/LoadingError";
import LoadingPage from "#app/components/PrivateLayout/LoadingPage";
import OrganizationRead from "./OrganizationRead/OrganizationRead";
import OrganizationEdit from "./OrganizationEdit/OrganizationEdit";
import { mapGetters } from "vuex";

export default {
    components: {
        PrivateLayout,
        PrivateContainer,
        LoadingError,
        LoadingPage,
        OrganizationRead,
        OrganizationEdit
    },
    data() {
        return {
            edit: false
        };
    },
    methods: {
        async load() {
            if (this.$store.state.directory.items.length === 0) {
                this.$store.dispatch("fetchDirectory");
            }
        }
    },
    created() {
        this.load();
    },
    computed: {
        ...mapGetters({
            directoryLoading: "directoryLoading",
            directoryError: "directoryError",
            directory: "directory"
        }),
        organization() {
            const orgID = parseInt(this.$route.params.id, 10);
            return this.directory.find(item => item.id === orgID);
        }
    }
};
</script>
