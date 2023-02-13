import { exportComments, exportActions } from "@/api/actions.api";

export default [
    {
        label: "Export des actions",
        filename: "actions",
        downloadFn: exportActions,
    },
    {
        label: "Export des commentaires",
        filename: "messages",
        downloadFn: exportComments,
    },
];
