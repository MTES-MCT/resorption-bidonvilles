<template>
    <component :is="wrapper" :class="['input', {'input-expand': width === 'expand'}]">
        <label :for="id" v-if="label">{{ label }}</label>
        <input
                :id="id"
                :disabled="disabled"
                :type="type"
                :value="value"
                :placeholder="placeholder"
                class="bg-white outline-none border border-gray-300 rounded-lg py-2 px-4 w-full appearance-none leading-normal"
                @input="onInput($event.target.value)"
                @focus="onFocus($event.target.value)"
        >
    </component>
</template>

<script>
    export default {
        name: "Input",
        props: {
            /**
             * The type of the form input field.
             * `text, number, email`
             */
            type: {
                type: String,
                default: "text",
                validator: value => {
                    return value.match(/(text|number|email)/)
                },
            },
            /**
             * Text value of the form input field.
             */
            value: {
                type: String,
                default: null,
            },
            /**
             * The placeholder value for the form input field.
             */
            placeholder: {
                type: String,
                default: null,
            },
            /**
             * The label of the form input field.
             */
            label: {
                type: String,
                default: null,
            },
            /**
             * The html element name used for the wrapper.
             * `div, section`
             */
            wrapper: {
                type: String,
                default: "div",
                validator: value => {
                    return value.match(/(div|section)/)
                },
            },
            /**
             * Unique identifier of the form input field.
             */
            id: {
                type: String,
                default: null,
            },
            /**
             * The width of the form input field.
             * `auto, expand`
             */
            width: {
                type: String,
                default: "expand",
                validator: value => {
                    return value.match(/(auto|expand)/)
                },
            },
            /**
             * Whether the form input field is disabled or not.
             * `true, false`
             */
            disabled: {
                type: Boolean,
                default: false,
            },
            /**
             * Manually trigger various states of the input.
             * `hover, active, focus`
             */
            state: {
                type: String,
                default: null,
                validator: value => {
                    return value.match(/(hover|active|focus)/)
                },
            },
        },
        methods: {
            onInput(value) {
                this.$emit("change", value)
            },
            onFocus(value) {
                this.$emit("focus", value)
            },
        },
    }
</script>
