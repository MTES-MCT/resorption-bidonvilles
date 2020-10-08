<template>
    <InputWrapper>
        <InputLabel :label="label" :info="info" />
        <ValidationProvider ref="provider" :rules="rules" :name="validationName || label" v-slot="{ errors }" :vid="id">
            <Datepicker :input-class="inputClasses" v-bind="$attrs" v-on="$listeners" :language="dateLanguage" :monday-first="true"></Datepicker>
            <InputError>{{ errors[0] }}</InputError>
        </ValidationProvider>
    </InputWrapper>
</template>

<script>
    import Datepicker from 'vuejs-datepicker';
    import { fr } from 'vuejs-datepicker/dist/locale';
    import getInputClasses from './primitives/input/utils/getInputClasses';
    import InputLabel from './primitives/input/utils/InputLabel'
    import InputWrapper from './primitives/input/utils/InputWrapper'
    import InputInfo from './primitives/input/utils/InputInfo'
    import InputError from './primitives/input/utils/InputError'

    export default {
        props: {
            label: {
                type: String
            },
            info: {
                type: String
            },
            id: {
                type: String
            },
            validationName: {
                type: String,
            },
            variant: {
                type: String,
                default: 'default'
            },
            rules: {
                type: String
            }
        },
        components: {
            Datepicker,
            InputLabel,
            InputWrapper,
            InputError,
            InputInfo
        },
        data() {
            return {
                dateLanguage: fr
            }
        },
        computed: {
            inputClasses() {
                return {
                    state: [...getInputClasses('state', this.error)],
                    default: getInputClasses('default')
                }[this.variant]
            }
        },
    }
</script>
