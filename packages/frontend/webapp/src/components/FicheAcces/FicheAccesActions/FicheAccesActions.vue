<template>
    <ErrorSummary v-if="error" :message="error" />
    <div class="flex justify-end space-x-4">
        <component
            v-for="(action, index) in actions"
            :key="action.id"
            :is="action.component"
            :user="user"
            :isLoading="isLoading === action.id"
            :disabled="(isLoading && isLoading !== action.id) || undefined"
            @mouseover="markHover(action.id)"
            @mouseleave="markHover(null)"
            @click="execute(index)"
        />
    </div>
    <p class="mt-2 italic text-right">&nbsp;{{ hoveredActionDescription }}</p>
</template>

<script setup>
import { defineProps, toRefs, ref, computed } from "vue";
import { ErrorSummary } from "@resorptionbidonvilles/ui";

// actions
import setIntervenant from "./actions/setIntervenant.action";
import setAdminLocal from "./actions/setAdminLocal.action";
import copyActivationLink from "./actions/copyActivationLink.action";
import deactivate from "./actions/deactivate.action";
import denyAccess from "./actions/denyAccess.action";
import grantAccess from "./actions/grantAccess.action";
import ACTION_DESCRIPTIONS from "./FicheAccesActions.descriptions";

// boutons d'action
import FicheAccesActionSetIntervenant from "./FicheAccesActionSetIntervenant.vue";
import FicheAccesActionUpgradeAdminLocal from "./FicheAccesActionUpgradeAdminLocal.vue";
import FicheAccesActionDowngradeAdminLocal from "./FicheAccesActionDowngradeAdminLocal.vue";
import FicheAccesActionCopyActivationLink from "./FicheAccesActionCopyActivationLink.vue";
import FicheAccesActionDeactivate from "./FicheAccesActionDeactivate.vue";
import FicheAccesActionDenyAccess from "./FicheAccesActionDenyAccess.vue";
import FicheAccesActionGrantAccess from "./FicheAccesActionGrantAccess.vue";

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

const actions = [
    {
        id: "set_intervenant",
        component: FicheAccesActionSetIntervenant,
        action: setIntervenant,
    },
    {
        id: "upgrade_admin_local",
        component: FicheAccesActionUpgradeAdminLocal,
        action: (...args) => {
            return setAdminLocal(...args, true);
        },
    },
    {
        id: "downgrade_admin_local",
        component: FicheAccesActionDowngradeAdminLocal,
        action: (...args) => {
            return setAdminLocal(...args, false);
        },
    },
    {
        id: "copy_activation_link",
        component: FicheAccesActionCopyActivationLink,
        action: copyActivationLink,
    },
    {
        id: "deactivate",
        component: FicheAccesActionDeactivate,
        action: deactivate,
    },
    {
        id: "deny_access",
        component: FicheAccesActionDenyAccess,
        action: denyAccess,
    },
    {
        id: "grant_access",
        component: FicheAccesActionGrantAccess,
        action: (...args) => {
            return grantAccess(...args, options.value);
        },
    },
];

const isLoading = ref(null);
const error = ref(null);

const hoveredActionId = ref(null);
const hoveredActionDescription = computed(() => {
    if (hoveredActionId.value === null) {
        return;
    }

    return ACTION_DESCRIPTIONS[hoveredActionId.value];
});
function markHover(actionId) {
    hoveredActionId.value = actionId;
}

async function execute(index, ...args) {
    const { id, action } = actions[index];
    if (isLoading.value !== null) {
        return;
    }

    isLoading.value = id;
    error.value = null;
    try {
        await action(user.value, ...args);
    } catch (e) {
        error.value = e?.user_message || "Une erreur inconnue est survenue";
    }

    isLoading.value = null;
}
</script>