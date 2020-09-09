<template>
    <div>
        <div class="panel" v-for="section in formDefinition">
            <div class="panel__header">
                <h3>{{section.title}}</h3>

                <Input v-for="(input, inputId) in section.inputs"  :id="inputId" v-bind="input" v-model="data[inputId]"  v-if="isInputVisible(input)" :errors="(errors && errors.fields && errors.fields[inputId]) || undefined" :disabled="isInputDisabled(input)" :alertMessage="getInputAlert(input)" @change="onDataChange" />
            </div>
        </div>
    </div>
</template>

<script>
    import Input from '#app/components/form/input/input.vue';

    export default {
        props: {
            data: {
                type: Object,
                required: true
            },
            formDefinition: {
                type: Array,
                required: true
            }
        },
        components: {
            Input
        },
        data() {
            return {
                errors: {}
            }
        },
        methods: {
            onDataChange() {
                this.refreshId += 1;
                this.$emit('input', this.data);
            },

            /**
             * Indicates whether the given input is visible or not
             *
             * Please note that an input might be visible but inactive (meaning disabled and
             * not included in filtered-data).
             *
             * @param {Input} input
             *
             * @returns {Boolean}
             */
            isInputVisible(input) {
                return this.isInputActive(input) || input.inactiveMessage;
            },

            /**
             * Indicates whether the given input is disabled or not
             *
             * @param {Input} input
             *
             * @returns {Boolean}
             */
            isInputDisabled(input) {
                return this.pending === true || input.disabled === true || (input.inactiveMessage && !this.isInputActive(input));
            },

            /**
             * Indicates whether the given input is active or not
             *
             * @param {Input} input
             *
             * @returns {Boolean}
             */
            isInputActive(input) {
                if (!input.condition) {
                    return true;
                }

                return input.condition(this.data);
            },

            /**
             * Returns the alert message to be displayed for the given input
             *
             * @param {Input} input
             *
             * @returns {String|Null}
             */
            getInputAlert(input) {
                if (input.inactiveMessage && !this.isInputActive(input)) {
                    return input.inactiveMessage;
                }

                return null;
            },
        }
    }
</script>
