import { useNotificationStore } from "@/stores/notification.store";
import copyToClipboard from "./copyToClipboard";

function handleParcelle(feature, layer) {
    const notificationStore = useNotificationStore();
    const { numero, feuille, section, code_insee } = feature.properties;
    layer.bindTooltip(
        `N°${numero}<br/>Feuille ${feuille}<br/>Section ${section}<br/>N°INSEE ${code_insee}`
    );

    layer.on("click", async () => {
        const result = await copyToClipboard(
            `N°${numero}\nFeuille ${feuille}\nSection ${section}\nN°INSEE ${code_insee}`
        );

        if (result) {
            notificationStore.success(
                "Copie de la parcelle cadastrale",
                "Les données de cette parcelle cadastrale ont bien été copiées dans votre presse-papier"
            );
        } else {
            notificationStore.error(
                "Copie de la parcelle cadastrale",
                "Les données de cette parcelle cadastrale n'ont pas été copiées dans votre presse-papier"
            );
        }
    });
}

export default handleParcelle;
