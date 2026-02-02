<template>
    <tr class="border-b border-gray-200 hover:bg-gray-50">
        <td class="p-3">{{ formatDate(log.attemptedAt) }}</td>
        <td class="p-3">{{ log.email }}</td>
        <td class="p-3">
            <router-link
                v-if="log.user"
                :to="`/utilisateur/${log.userId}`"
                class="text-blue-600 hover:underline"
            >
                {{ log.user.firstName }} {{ log.user.lastName }}
            </router-link>
            <span v-else class="text-gray-400">-</span>
        </td>
        <td class="p-3">
            <span
                v-if="log.success"
                class="px-2 py-1 bg-green-100 text-green-800 rounded text-sm"
            >
                Succès
            </span>
            <span
                v-else
                class="px-2 py-1 bg-red-100 text-red-800 rounded text-sm"
            >
                Échec
            </span>
        </td>
        <td class="p-3">
            <span v-if="log.failureReason" class="text-sm text-gray-700">
                {{ formatFailureReason(log.failureReason) }}
            </span>
            <span v-else class="text-gray-400">-</span>
        </td>
        <td class="p-3">{{ log.responseTimeMs }}</td>
        <td class="p-3 text-sm text-gray-600">
            {{ log.ipAddress || "-" }}
        </td>
    </tr>
</template>

<script setup>
import { defineProps } from "vue";
import formatTimestamp from "@/utils/formatTimestamp";

defineProps({
    log: {
        type: Object,
        required: true,
    },
});

function formatDate(dateValue) {
    const timestamp = new Date(dateValue).getTime() / 1000;
    return formatTimestamp(timestamp, "d/m/y à h:i");
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
