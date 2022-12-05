import { defineStore } from "pinia";

export const useNotificationStore = defineStore("notification", {
    state: () => ({
        id: 0,
        items: [],
    }),

    actions: {
        addItem(variant, title, description) {
            this.items.push({
                id: this.id,
                variant,
                title,
                description,
            });
            this.id++;
        },
        removeItem(argId) {
            const index = this.items.findIndex(({ id }) => id === argId);
            if (index === -1) {
                return;
            }

            this.items.splice(index, 1);
        },
        error(title, description) {
            this.addItem("error", title, description);
        },
        info(title, description) {
            this.addItem("info", title, description);
        },
        success(title, description) {
            this.addItem("success", title, description);
        },
    },
});
