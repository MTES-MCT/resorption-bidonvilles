import { ref } from "vue";
import { defineStore } from "pinia";

export const useInputsStore = defineStore("input", () => {
    const inputs = ref([]);
    const options = ref([]);

    const reset = () => {
        inputs.value = [];
        options.value = [];
    };

    const handleOptions = (data) => {
        options.value = data;
    };

    return {
        inputs,
        options,
        handleOptions,
        reset,
    };
});
