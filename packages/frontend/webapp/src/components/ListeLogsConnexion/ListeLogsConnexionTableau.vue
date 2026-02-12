<template>
    <div class="w-full max-w-7xl mx-auto">
        <DsfrTable
            title="Logs de connexion"
            :headers="headers"
            :no-caption="true"
        >
            <tr v-for="log in logsStore.currentPage.content" :key="log.id">
                <td>{{ formatDate(log.attemptedAt) }}</td>
                <td>{{ log.email }}</td>
                <td>
                    <router-link
                        v-if="log.user"
                        :to="`/utilisateur/${log.userId}`"
                        class="user-link"
                    >
                        {{ log.user.firstName }} {{ log.user.lastName }}
                    </router-link>
                    <span v-else>-</span>
                </td>
                <td>
                    <DsfrTag
                        :label="log.success ? 'Succès' : 'Échec'"
                        :class="log.success ? 'success' : 'error'"
                    />
                </td>
                <td>{{ getReasonField(log) }}</td>
                <td>{{ log.responseTimeMs }}</td>
                <td>{{ log.ipAddress || "-" }}</td>
            </tr>
        </DsfrTable>
        <div class="flex justify-center mt-6">
            <DsfrPagination
                v-if="logsStore.numberOfPages > 0"
                :pages="pages"
                v-model:current-page="currentPageIndex"
                :truncLimit="3"
            />
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue";
import { useSigninLogsStore } from "@/stores/signinLogs.store";
import formatTimestamp from "@common/utils/formatTimestamp.js";

const logsStore = useSigninLogsStore();

const headers = [
    "Date/Heure",
    "Email",
    "Utilisateur",
    "Statut",
    "Raison",
    "Temps (ms)",
    "IP",
];

const pages = computed(() => {
    const results = [];

    for (let i = 1; i <= logsStore.numberOfPages; i++) {
        results.push({
            title: `${i}`,
            href: `${i}`,
            label: i,
        });
    }

    return results;
});

// Conversion entre index 1-based (store) et 0-based (DsfrPagination)
const currentPageIndex = computed({
    get: () => logsStore.currentPage.index - 1,
    set: (value) => {
        logsStore.currentPage.index = value + 1;
    },
});

function formatDate(dateValue) {
    const timestamp = new Date(dateValue).getTime() / 1000;
    return formatTimestamp(timestamp, "d/m/y à h:i");
}

function getReasonField(log) {
    return log.failureReason ? formatFailureReason(log.failureReason) : "-";
}

function formatFailureReason(reason) {
    const reasons = {
        invalid_email_format: "Email invalide",
        invalid_password_format: "Mot de passe invalide",
        user_not_found: "Utilisateur introuvable",
        inactive_account: "Compte inactif",
        wrong_password: "Mot de passe incorrect",
        rate_limited: "Trop de tentatives",
        api_error: "Erreur API",
    };
    return reasons[reason] || reason;
}
</script>

<style scoped>
:deep(.success) {
    color: var(--success-425-625);
    background-color: var(--success-950-100);
}

:deep(.error) {
    color: var(--error-425-625);
    background-color: var(--error-950-100);
}

:deep(.fr-badge--success) {
    background-color: var(--success-950-100);
    color: var(--success-425-625);
}

:deep(.fr-badge--error) {
    background-color: var(--error-950-100);
    color: var(--error-425-625);
}

:deep(a) {
    color: var(--blue-850-100);
    text-decoration: underline;
}

:deep(a:hover) {
    color: var(--blue-850-200);
}

:deep(.user-link) {
    color: var(--blue-850-100);
    text-decoration: underline;
    cursor: pointer;
}

:deep(.user-link:hover) {
    color: var(--blue-850-200);
}

:deep(.fr-table) {
    width: 100%;
}
</style>
