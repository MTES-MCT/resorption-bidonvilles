<template>
    <DetailsPanel>
        <template v-slot:title>Contacts</template>
        <template v-slot:body>
            <DetailsPanelSection>
                <span class="font-bold">Pilote</span>
                <OrganizationDetailsUser
                    v-for="user in plan.government_contacts"
                    :key="user.id"
                    :user="user"
                    :linkToUser="false"
                />
            </DetailsPanelSection>
            <DetailsPanelSection>
                <span class="font-bold">Opérateur ou service en charge</span>
                <OrganizationDetailsUser
                    v-for="user in plan.operator_contacts"
                    :key="user.id"
                    :user="user"
                    :linkToUser="false"
                />
            </DetailsPanelSection>
        </template>
    </DetailsPanel>
</template>

<script>
import DetailsPanel from "#app/components/ui/details/DetailsPanel.vue";
import DetailsPanelSection from "#app/components/ui/details/DetailsPanelSection.vue";
import OrganizationDetailsUser from "#app/pages/OrganizationDetails/OrganizationUser/OrganizationDetailsUser.vue";

export default {
    props: {
        plan: {
            type: Object
        }
    },

    components: {
        DetailsPanel,
        DetailsPanelSection,
        OrganizationDetailsUser
    }
};
</script>
