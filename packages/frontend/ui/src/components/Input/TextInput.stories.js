import TextInput from './TextInput.vue';

export default {
    title: 'TextInput',
    component: TextInput
};

export const RegularTextInput = () => ({
    components: { TextInput },
    template: '<TextInput  label="Saisie"/>'
});

export const RequiredTextInput = () => ({
    components: { TextInput },
    template: '<TextInput :showMandatoryStar="true" label="Saisie Obligatoire" />'
});

