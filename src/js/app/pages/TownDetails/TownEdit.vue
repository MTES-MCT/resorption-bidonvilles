<template>
    <div>
        <FormPanel :data="data" :formDefinition="formDefinition" />

        <div class="notification error" v-if="editError">{{ editError }}.</div>

        <div class="form__group">
            <button class="button large" @click="submit">Sauvegarder</button>
        </div>
    </div>
</template>

<script>
    import FormPanel from '#app/components/form/formPanel.vue';

    export default {
        components: {
            FormPanel
        },
        props: {
            data: {
                type: Object,
                required: true
            },
            formDefinition: {
                type: Array,
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
        mounted() {
            console.log(this.props)
        }
    }
</script>
