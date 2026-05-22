<template>
    <div class="w-full max-w-7xl mx-auto">
        <DsfrTable
            title="Liste des actions"
            :headers="headers"
            :no-caption="true"
        >
            <tr
                v-for="action in actionsStore.currentPage.content"
                :key="action.id"
                class="cursor-pointer hover:bg-blue-france-925-125"
                @click="navigateToAction(action.id)"
            >
                <td @click.stop>
                    <DsfrTagCopy
                        :label="action.displayId"
                        dataType="Identifiant de l'action"
                        title="Cliquer pour copier l'identifiant"
                    />
                    <div
                        class="text-sm text-gray-600 mt-1"
                        v-if="action.started_at"
                    >
                        Débutée le {{ formatDate(action.started_at) }}
                    </div>
                </td>
                <td>
                    {{ getPrincipalOperatorName(action) }}
                </td>
                <td>
                    <div class="font-bold">
                        {{ formatProjectName(action) }}
                    </div>
                </td>
                <td>
                    {{ getDepartementLabel(action) }}
                </td>
                <td>
                    <DsfrTag
                        :label="getMetricsStatus(action).label"
                        :class="getMetricsStatusClass(action)"
                    />
                </td>
            </tr>
        </DsfrTable>
        <div class="flex justify-center mt-6">
            <DsfrPagination
                v-if="actionsStore.numberOfPages > 0"
                :pages="pages"
                v-model:current-page="currentPageIndex"
                :truncLimit="3"
            />
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useActionsStore } from "@/stores/actions.store";
import getSince from "@/utils/getSince";
import formatMetricsUpdatedAt from "@/utils/formatMetricsUpdatedAt";
import { formatProjectName } from "@/utils/formatActionName";
import { useNotificationStore } from "@/stores/notification.store";
import formatTimestamp from "@common/utils/formatTimestamp";
import DsfrTagCopy from "@/components/DsfrTagCopy/DsfrTagCopy.vue";

const router = useRouter();
const actionsStore = useActionsStore();
const notificationStore = useNotificationStore();

const headers = [
    "Identifiant de l'action",
    "Opérateur",
    "Nom de l'action",
    "Département",
    "Statut des indicateurs",
];

const pages = computed(() => {
    const results = [];
    for (let i = 1; i <= actionsStore.numberOfPages; i++) {
        results.push({
            title: `${i}`,
            href: `${i}`,
            label: i,
        });
    }
    return results;
});

const currentPageIndex = computed({
    get: () => actionsStore.currentPage.index - 1,
    set: (value) => {
        actionsStore.currentPage.index = value + 1;
    },
});

const navigateToAction = (actionId) => {
    router.push(`/action/${actionId}`);
};

const formatDate = (timestamp) => {
    if (!timestamp) {
        return "";
    }
    return formatTimestamp(timestamp / 1000, "d/m/y");
};

const capitalizeFirstLetter = (str) => {
    if (!str) {
        return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const getPrincipalOperatorName = (action) => {
    if (!action.operators || action.operators.length === 0) {
        return "-";
    }
    const principalOperator = action.operators.find((op) => op.is_principal);
    const operator = principalOperator || action.operators[0];

    if (operator.abbreviation) {
        return operator.abbreviation;
    }
    return capitalizeFirstLetter(operator.name);
};

const getDepartementLabel = (action) => {
    if (!action.location?.departement) {
        return "-";
    }
    return `${action.location.departement.name} (${action.location.departement.code})`;
};

const getMetricsStatus = (action) => {
    const label = formatMetricsUpdatedAt(action);

    if (!action.metrics_updated_at) {
        return {
            label,
            type: "error",
        };
    }

    const { months } = getSince(action.metrics_updated_at / 1000);

    if (months >= 3) {
        return {
            label,
            type: "warning",
        };
    }

    return {
        label,
        type: "success",
    };
};

const getMetricsStatusClass = (action) => {
    const status = getMetricsStatus(action);
    const classMap = {
        warning: "status-warning",
        error: "status-error",
        success: "status-success",
    };
    return classMap[status.type] || "";
};
</script>

<style scoped>
:deep(.status-warning) {
    background-color: var(--warning-950-100);
    color: var(--warning-425-625);
}

:deep(.status-error) {
    background-color: var(--error-950-100);
    color: var(--error-425-625);
}

:deep(.status-success) {
    background-color: var(--success-950-100);
    color: var(--success-425-625);
}
</style>
