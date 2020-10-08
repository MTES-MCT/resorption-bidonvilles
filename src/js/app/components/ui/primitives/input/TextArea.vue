<template>
    <InputWrapper>
        <InputLabel :label="label" :info="info" />
        <ValidationProvider :rules="rules" :name="validationName || label" v-slot="{ errors }" :vid="id">
            <textarea
                   :id="id"
                   @input="$emit('input', $event.target.value)"
                   v-bind="$props"
                   :class="classes" />
            <InputError>{{errors[0]}}</InputError>
        </ValidationProvider>
    </InputWrapper>
</template>

<script>
import filteredProps from '../../mixins/filteredProps';
import InputLabel from './utils/InputLabel'
import InputWrapper from './utils/InputWrapper'
import InputInfo from './utils/InputInfo'
import InputError from './utils/InputError'
import getInputClasses from './utils/getInputClasses';

export default {
    name: "TextArea",
    mixins: [filteredProps],
    props: {
        label: {
            type: String
        },
        info: {
            type: String
        },
        placeholder: {
            type: String
        },
        type: {
            type: String,
            default: 'text'
        },
        value: {
            type: String,
        },
        rules: {
            type: String,
        },
        validationName: {
            type: String
        },
        id: {
            type: String
        },
        variant: {
            type: String,
            default: 'default'
        },

    },
    computed: {
        classes() {
            return {
                state: [...getInputClasses('state', this.error)],
                default: getInputClasses('default')
            }[this.variant]
        }
    },
    components: {
        InputLabel,
        InputWrapper,
        InputError,
        InputInfo
    }
}
</script>
