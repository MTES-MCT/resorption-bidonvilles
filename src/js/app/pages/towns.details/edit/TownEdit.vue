<template>
    <div>
        <TownEditForm :data="data" :formDefinition="formDefinition" />

        <div class="notification error" v-if="editError">{{ editError }}.</div>

        <div class="form__group">
            <button class="button large" @click="submit">Sauvegarder</button>
        </div>
    </div>
</template>

<script>
    import TownEditForm from './TownEditForm';
    import getTownEditFormDefinition from './getTownEditFormDefinition'

    function boolToYesNoValue(bool) {
        if (bool === true) {
            return 1;
        }

        if (bool === false) {
            return 0;
        }

        return -1;
    }

    export default {
        components: {
            TownEditForm
        },
        props: {
            submit: {
                type: Function,
                required: true
            },
            data: {
                type: Object,
                required: true
            },
            editError: {
                required: true
            },
            fieldErrors: {
                required: true
            }
        },
        data() {
            return {
                formDefinition: getTownEditFormDefinition(),
            }
        },
    }
</script>
