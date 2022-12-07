import { computed } from "vue";
import { useUserStore } from "@/stores/user.store";

import { exportList as exportUsers } from "@/api/users.api";
import { exportList as exportActors } from "@/api/actors.api";
import { exportList as exportReferrals } from "@/api/contact_form_referrals.api";
import {
    exportMobileSessions,
    exportWebappSessions,
} from "@/api/navigation_logs.api";

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
    mobileSessions: {
        label: "Export des sessions sur mobile",
        filename: "sessions_mobile",
        downloadFn: exportMobileSessions,
    },
    webappSessions: {
        label: "Export des sessions sur navigateur",
        filename: "sessions_navigateur",
        downloadFn: exportWebappSessions,
    },
};

export default computed(() => {
    const userStore = useUserStore();

    const filteredExportList = [];
    if (userStore.user?.is_superuser) {
        filteredExportList.push(exportList.users);
        filteredExportList.push(exportList.mobileSessions);
        filteredExportList.push(exportList.webappSessions);
    }

    if (userStore.hasPermission("shantytown_actor.export")) {
        filteredExportList.push(exportList.actors);
    }

    if (userStore.hasPermission("contact_form_referral.access")) {
        filteredExportList.push(exportList.referrals);
    }

    return filteredExportList;
});
