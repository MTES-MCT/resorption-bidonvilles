<template>
    <InputWrapper>
        <InputLabel :label="label" :info="info" />
        <ValidationProvider :rules="rules" :name="validationName || label" v-slot="{ errors }" :vid="id">
            <input
                   :id="id"
                   @input="$emit('input', $event.target.value)"
                   v-bind="$props"
                   :class="classes" />
            <InputError>{{ errors[0] }}</InputError>
        </ValidationProvider>
    </InputWrapper>
</template>

<script>
import InputLabel from './utils/InputLabel'
import InputWrapper from './utils/InputWrapper'
import InputInfo from './utils/InputInfo'
import InputError from './utils/InputError'

export default {
    name: "TextInput",
    props: {
        label: {
            type: String
        },
        error: {
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
        validationName: {
            type: String,
        },
        rules: {
            type: String,
        },
        value: {
            type: String,
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
                state: ['bg-G200 border-b-2 border-black rounded rounded-b-none w-full py-2 px-4 outlinePadding', this.error && 'border-error'],
                default: ['border-2 border-G200 rounded-md w-full py-2 px-4 outline-none focus:border-primary'],
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

<style scoped>
    .outlinePadding {
        outline-offset: 4px
    }
</style>
