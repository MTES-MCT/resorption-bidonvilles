import { computed } from "vue";
import { useUserStore } from "@/stores/user.store";

import { exportList as exportActors } from "@/api/actors.api";
import { exportList as exportReferrals } from "@/api/contact_form_referrals.api";
import { exportTownsReport } from "@/api/data_reports.api";
import { exportWebappSessions } from "@/api/navigation_logs.api";
import { exportList as exportUsers } from "@/api/users.api";

const exportList = {
    users: {
        label: "Export de tous les accès",
        filename: "utilisateurs",
        downloadFn: exportUsers,
    },
    actors: {
        label: 'Export des accès "Intervenant"',
        filename: "intervenants",
        downloadFn: exportActors,
    },
    referrals: {
        label: 'Export des réponses à "Comment avez-vous connu la plateforme ?"',
        filename: "referrals",
        downloadFn: exportReferrals,
    },
    webappSessions: {
        label: "Export des sessions sur navigateur",
        filename: "sessions_navigateur",
        downloadFn: exportWebappSessions,
    },
    townsReport: {
        label: "🌈 Bilan de situation",
        filename: "bilan",
        downloadFn: exportTownsReport,
        withDateRange: true,
        format: "xlsx",
    },
};

export default computed(() => {
    const userStore = useUserStore();

    const filteredExportList = [];
    if (userStore.hasPermission("user.export")) {
        filteredExportList.push(exportList.users);
    }

    if (userStore.user?.is_superuser) {
        filteredExportList.push(exportList.webappSessions);
        filteredExportList.push(exportList.townsReport);
    }

    if (userStore.hasPermission("shantytown_actor.export")) {
        filteredExportList.push(exportList.actors);
    }

    if (userStore.hasPermission("contact_form_referral.access")) {
        filteredExportList.push(exportList.referrals);
    }

    return filteredExportList;
});
