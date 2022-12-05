import { exportComments, exportPlans } from "@/api/plans.api";

export default [
    {
        label: "Export des actions",
        filename: "actions",
        downloadFn: exportPlans,
    },
    {
        label: "Export des commentaires",
        filename: "messages",
        downloadFn: exportComments,
    },
];
