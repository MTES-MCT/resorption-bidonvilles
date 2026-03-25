<template>
    <div class="w-full max-w-7xl mx-auto">
        <DsfrTable
            title="Liste des comptes"
            :headers="headers"
            :no-caption="true"
        >
            <tr
                v-for="user in accesStore.currentPage.content"
                :key="user.id"
                class="cursor-pointer hover:bg-blue-france-925-125"
                @click="navigateToUser(user.id)"
            >
                <td class="status-column">
                    <DsfrTag
                        :label="getAccessStatus(user).label"
                        :icon="getStatusIcon(user)"
                        :class="getStatusClass(user)"
                    />
                    <div
                        v-if="getAccessStatus(user).date"
                        class="text-sm text-gray-600 mt-1"
                    >
                        le {{ formatDate(getAccessStatus(user).date) }}
                    </div>
                </td>
                <td>
                    <div class="font-bold">
                        {{ user.last_name.toUpperCase() }} {{ user.first_name }}
                    </div>
                    <div class="text-sm text-gray-600">{{ user.position }}</div>
                    <div
                        v-if="user.last_access && userStore.user?.is_superuser"
                        class="text-sm text-gray-600"
                    >
                        Dernière connexion: {{ formatDate(user.last_access) }}
                    </div>
                </td>
                <td>
                    {{
                        user.organization.abbreviation || user.organization.name
                    }}
                </td>
                <td>
                    {{ getMainAreas(user).join(", ") }}
                </td>
                <td>
                    {{ user.role }}
                </td>
            </tr>
        </DsfrTable>
        <div class="flex justify-center mt-6">
            <DsfrPagination
                v-if="accesStore.numberOfPages > 0"
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
import { useAccesStore } from "@/stores/acces.store";
import { useUserStore } from "@/stores/user.store";
import accessStatuses from "@/utils/access_statuses";
import formatDate from "@common/utils/formatDate.js";

const router = useRouter();
const accesStore = useAccesStore();
const userStore = useUserStore();

const headers = [
    "Statut du compte",
    "NOM Prénom",
    "Structure",
    "Territoire(s)",
    "Type d'accès",
];

const pages = computed(() => {
    const results = [];
    for (let i = 1; i <= accesStore.numberOfPages; i++) {
        results.push({
            title: `${i}`,
            href: `${i}`,
            label: i,
        });
    }
    return results;
});

const currentPageIndex = computed({
    get: () => accesStore.currentPage.index - 1,
    set: (value) => {
        accesStore.currentPage.index = value + 1;
    },
});

function navigateToUser(userId) {
    router.push(`/acces/${userId}`);
}

function getAccessStatus(user) {
    return {
        ...user.access_status,
        ...accessStatuses[user.access_status.status],
    };
}

function getStatusIcon(user) {
    const status = user.access_status.status;
    const iconMap = {
        requested: "ri-flag-fill",
        expired: "ri-link-unlink",
        sent: "ri-plane-fill",
        activated: "ri-user-follow-fill",
        refused: "ri-prohibited-line",
        deactivated: "ri-flag-fill",
    };
    return iconMap[status] || "";
}

function getStatusClass(user) {
    const status = user.access_status.status;
    const classMap = {
        requested: "status-warning",
        expired: "status-neutral",
        sent: "status-info",
        activated: "status-success",
        refused: "status-neutral",
        deactivated: "status-neutral",
    };
    return classMap[status] || "";
}

function getMainAreas(user) {
    if (user.intervention_areas.is_national === true) {
        return ["National"];
    }
    return user.intervention_areas.areas
        .filter((area) => area.is_main_area)
        .map((area) => area[area.type].name);
}
</script>

<style scoped>
.status-column {
    min-width: 180px;
    white-space: nowrap;
}

/* Warning - équivalent DsfrBadge warning (Demandé) */
:deep(.status-warning) {
    background-color: var(--warning-950-100);
    color: var(--warning-425-625);
}

/* Info - équivalent DsfrBadge info (Envoyé) */
:deep(.status-info) {
    background-color: var(--info-950-100);
    color: var(--info-425-625);
}

/* Success - équivalent DsfrBadge success (Activé) */
:deep(.status-success) {
    background-color: var(--success-950-100);
    color: var(--success-425-625);
}

/* Neutral - noir sur fond grisé (Expiré, Sans suite, Désactivé) */
:deep(.status-neutral) {
    background-color: var(--grey-950-100);
    color: var(--grey-425-625);
}
</style>
