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
            <LoadingError v-else-if="!directoryLoading">
                La structure demandée n'existe pas en base de données ou n'a pas
                d'utilisateurs actifs
            </LoadingError>
            <LoadingPage v-else />
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
            if (this.directory.length === 0) {
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
            directory: "directory",
            getOrganization: "organization"
        }),
        organizationId() {
            return parseInt(this.$route.params.id, 10);
        },
        organization() {
            return this.getOrganization(this.organizationId);
        }
    }
};
</script>
