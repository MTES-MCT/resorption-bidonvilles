import { defineStore } from "pinia";
import { ref } from "vue";

export const useModaleStore = defineStore("modale", () => {
    const component = ref(null);
    const props = ref({});

    return {
        component,
        props,
        open(argComponent, argProps) {
            component.value = argComponent;
            props.value = argProps;
        },
        close() {
            component.value = null;
            props.value = {};
        },
    };
});
