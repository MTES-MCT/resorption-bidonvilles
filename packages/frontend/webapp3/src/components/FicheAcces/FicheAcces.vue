<template>
    <ViewHeader icon="user">
        <template v-slot:title>Fiche utilisateur</template>
        <template v-slot:description
            >Accordez, refusez, ou ajustez la demande d'accès de cet
            utilisateur</template
        >
    </ViewHeader>

    <InactiveUserWarning v-if="user.status === 'inactive'" class="mb-8" />

    <div class="flex space-x-8 justify-center">
        <FicheAccesColumn :user="user" />
        <FicheAccesBody :user="user" class="flex-1" v-model:options="options" />
    </div>

    <div class="mt-8" v-if="user.status !== 'inactive'">
        <FicheAccesActions :user="user" :options="options" />
    </div>
</template>

<script setup>
import { defineProps, toRefs, ref } from "vue";

import ViewHeader from "@/components/ViewHeader/ViewHeader.vue";
import InactiveUserWarning from "@/components/InactiveUserWarning/InactiveUserWarning.vue";
import FicheAccesColumn from "./FicheAccesColumn/FicheAccesColumn.vue";
import FicheAccesBody from "./FicheAccesBody/FicheAccesBody.vue";
import FicheAccesActions from "./FicheAccesActions/FicheAccesActions.vue";

const props = defineProps({
    user: {
        type: Object,
        required: true,
    },
});
const { user } = toRefs(props);
const options = ref(user.value.permission_options || []);
</script>
