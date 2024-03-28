<template>
    <section>
        <FicheAccesBodyMessage :user="user" />
        <FicheAccesBodyRole :user="user" :options="user.permission_options" />
        <FicheAccesBodyAdminComments
            v-if="userStore.user?.is_superuser"
            :user="user"
        />
        <FicheAccesBodyWarning v-if="user.status === 'new'" />

        <div class="mt-8">
            <FicheAccesActions :user="user" :options="options" />
        </div>

        <FicheAccesBodyDeactivate
            v-if="
                userStore.hasPermission('user.deactivate') &&
                user.id !== userStore.user?.id &&
                (isExpired || user.status === 'active')
            "
            :user="user"
        />
    </section>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import { useUserStore } from "@/stores/user.store";
import { useInputsStore } from "@/stores/inputs.store";
import isUserAccessExpired from "@/utils/isUserAccessExpired";

import FicheAccesBodyMessage from "./FicheAccesBodyMessage.vue";
import FicheAccesBodyRole from "./FicheAccesBodyRole.vue";
import FicheAccesBodyAdminComments from "./FicheAccesBodyAdminComments.vue";
import FicheAccesBodyDeactivate from "./FicheAccesBodyDeactivate.vue";
import FicheAccesBodyWarning from "./FicheAccesBodyWarning.vue";
import FicheAccesActions from "../FicheAccesActions/FicheAccesActions.vue";
import { onMounted } from "vue";

const props = defineProps({
    user: {
        type: Object,
        required: true,
    },
    options: {
        type: Array,
        required: true,
    },
});
const { user, options } = toRefs(props);

const userStore = useUserStore();

const isExpired = computed(() => {
    return isUserAccessExpired(user.value);
});

onMounted(() => {
    const inputsStore = useInputsStore();
    inputsStore.handleOptions(user.value.permission_options);
});
</script>
