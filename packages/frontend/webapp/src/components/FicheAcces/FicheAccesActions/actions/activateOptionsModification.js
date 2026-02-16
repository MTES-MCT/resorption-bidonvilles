import { useAccesStore } from "@/stores/acces.store";

export default function () {
    const accesStore = useAccesStore();
    accesStore.toggleOptions();
}
