import PasswordInput from "./PasswordInput.vue";

export default {
    title: 'PasswordInput',
    component: PasswordInput
};


export const RegularPasswordInput = () => ({
    components: { PasswordInput },
    template: '<PasswordInput  label="Saisie"/>'
});
