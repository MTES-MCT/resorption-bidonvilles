import { computed } from "vue";
import { useUserStore } from "@/stores/user.store";

export default function usePhoneVisibility() {
    const userStore = useUserStore();

    const hidePhone = computed(() => {
        return userStore.user?.is_admin !== true;
    });

    return { hidePhone };
}
