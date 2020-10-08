<template>
    <InputWrapper>
        <InputLabel :label="label" :info="info" />
        <ValidationProvider :rules="rules" :name="validationName || label" v-slot="{ errors }" :vid="id">
            <div class="relative">
                <select :class="classes" v-bind="$props" @change="$emit('input', $event.target.value)" :id="id">
                    <slot />
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <Icon icon="chevron-down" />
                </div>
            </div>
            <InputError>{{errors[0]}}</InputError>
        </ValidationProvider>
    </InputWrapper>
</template>

<script>
    import InputLabel from './utils/InputLabel'
    import InputWrapper from './utils/InputWrapper'
    import InputInfo from './utils/InputInfo'
    import InputError from './utils/InputError'

    export default {
        name: "Select",
        props: {
            label: {
                type: String
            },
            info: {
                type: String
            },
            error: {
                type: String
            },
            value: {
                type: String
            },
            validationName: {
                type: String
            },
            rules: {
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
                    state: ['block appearance-none bg-G200 border-b-2 border-black rounded rounded-b-none w-full py-2 px-4 outlinePadding', this.error && 'border-error'],
                    default: ['appearance-none border-2 border-G200 rounded-md w-full py-2 px-4 outline-none focus:border-primary'],
                }[this.variant]
            }
        },
        components: {
            InputWrapper,
            InputLabel,
            InputInfo,
            InputError
        }
    }
</script>

<style scoped>
    .outlinePadding {
        outline-offset: 4px
    }
</style>
