<template>
    <div>
        <FormPanel :data="edit" :formDefinition="formDefinition" />

        <div class="notification error" v-if="editError">{{ editError }}.</div>

        <div class="form__group">
            <button class="button large" @click="submit">Sauvegarder</button>
        </div>
    </div>
</template>

<script>
    import FormPanel from '#app/components/form/formPanel.vue';
    import getEditFormDefinition from "./getEditFormDefinition";

    export default {
        components: {
            FormPanel
        },
        props: {
            edit: {
                type: Object,
                required: true
            },
            editError: {
                required: true
            },
            submit: {
                type: Function,
                required: true
            }
        },
        data() {
            return {
                formDefinition: getEditFormDefinition()
            }
        }
    }
</script>
