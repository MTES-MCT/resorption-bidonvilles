<template>
    <ViewHeader icon="user">
        <template v-slot:title>Fiche utilisateur</template>
        <template v-slot:description
            >Accordez, refusez, ou ajustez la demande d'accès de cet
            utilisateur</template
        >
    </ViewHeader>

    <InactiveUserWarning v-if="user.status === 'inactive'" class="mb-8" />
    <RefusedUserAccount v-if="user.status === 'refused'" class="mb-8" />

    <div class="flex space-x-8 justify-center">
        <FicheAccesColumn :user="user" />
        <FicheAccesBody :user="user" class="flex-1" v-model:options="options" />
    </div>
</template>

<script setup>
import { defineProps, toRefs, ref, computed } from "vue";
import { useConfigStore } from "@/stores/config.store";

import ViewHeader from "@/components/ViewHeader/ViewHeader.vue";
import InactiveUserWarning from "@/components/InactiveUserWarning/InactiveUserWarning.vue";
import RefusedUserAccount from "@/components/RefusedUserAccount/RefusedUserAccount.vue";
import FicheAccesColumn from "./FicheAccesColumn/FicheAccesColumn.vue";
import FicheAccesBody from "./FicheAccesBody/FicheAccesBody.vue";

const props = defineProps({
    user: {
        type: Object,
        required: true,
    },
});
const { user } = toRefs(props);

const accessPermission = computed(() => {
    const configStore = useConfigStore();
    return configStore.config.permissions_description[user.value.role_id];
});
const optionList = computed(() => {
    return (accessPermission.value?.options || []).map(({ id }) => id);
});
const options = ref(
    user.value.user_accesses.length > 0
        ? user.value.permission_options || []
        : optionList.value
);
</script>
