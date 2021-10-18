<template>
    <PrivateLayout>
        <PrivateContainer class="py-8">
            <div v-if="!directoryLoading && organization">
                <Button
                    class="-ml-4 mb-8"
                    variant="primaryText"
                    icon="chevron-left"
                    href="/annuaire"
                    iconPosition="left"
                    >Aller à l'annuaire</Button
                >

                <h1 class="text-display-lg mb-8">{{ organization.name }}</h1>

                <div class="flex items-center mb-8">
                    <div class="mr-48">
                        <div>Territoire :</div>
                        <div class="text-lg">
                            {{ organization.locationName }}
                            <span v-if="organization.locationCode"
                                >({{ organization.locationCode }})</span
                            >
                        </div>
                    </div>
                </div>

                <OrganizationDetailsUser
                    class="mb-4"
                    v-for="user in organization.users"
                    :user="user"
                    :key="user.id"
                />
            </div>
            <LoadingError v-else-if="!directoryLoading && !organization">
                La structure demandée n'existe pas en base de données ou n'a pas
                d'utilisateurs actifs
            </LoadingError>

            <LoadingPage v-else-if="directoryLoading && organization" />
        </PrivateContainer>
    </PrivateLayout>
</template>
<script>
import PrivateLayout from "#app/components/PrivateLayout";
import PrivateContainer from "#app/components/PrivateLayout/PrivateContainer";
import LoadingError from "#app/components/PrivateLayout/LoadingError";
import LoadingPage from "#app/components/PrivateLayout/LoadingPage";
import { mapGetters } from "vuex";
import OrganizationDetailsUser from "#app/pages/OrganizationDetails/OrganizationDetailsUser";
export default {
    components: {
        OrganizationDetailsUser,
        PrivateLayout,
        PrivateContainer,
        LoadingError,
        LoadingPage
    },

    methods: {
        async load() {
            // on fetch les activités
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
