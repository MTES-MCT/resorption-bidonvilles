<template>
    <div class="flex items-center">
        <div class="mr-2" v-if="label">
            <div v-if="label" class="mb-2 text-sm italic">{{ label }}</div>
        </div>
        <ValidationProvider
            :rules="rules"
            :name="validationName || label"
            v-slot="{ errors }"
            :vid="id"
        >
            <div class="relative">
                <InputIcon
                    position="before"
                    :icon="prefixIcon"
                    v-if="prefixIcon"
                />
                <input
                    :id="id"
                    @input="$emit('input', $event.target.value)"
                    v-bind="filteredProps"
                    :class="classes"
                    :data-cy-field="cypressName"
                    :disabled="disabled"
                />
                <InputIcon
                    position="after"
                    :icon="suffixIcon"
                    v-if="suffixIcon"
                />
            </div>
            <InputError v-if="errors[0]">{{ errors[0] }}</InputError>
        </ValidationProvider>
    </div>
</template>

<script>
import filteredProps from "../../mixins/filteredProps";
import InputError from "../utils/InputError.vue";
import InputIcon from "../utils/InputIcon.vue";
import getInputClasses from "../utils/getInputClasses";

export default {
    name: "InlineTextInput",
    mixins: [filteredProps],
    props: {
        label: {
            type: String
        },
        placeholder: {
            type: String
        },
        type: {
            type: [String, Number],
            default: "text"
        },
        validationName: {
            type: String
        },
        rules: {
            type: String
        },
        value: {
            type: [String, Number]
        },
        id: {
            type: String
        },
        variant: {
            type: String,
            default: "default"
        },
        prefixIcon: {
            type: String
        },
        suffixIcon: {
            type: String
        },
        size: {
            type: String
        },
        cypressName: {
            type: String
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        classes() {
            const inputOptions = {
                error: this.error,
                prefixIcon: this.prefixIcon,
                suffixIcon: this.suffixIcon,
                size: this.size
            };

            return {
                state: [...getInputClasses("state", inputOptions)],
                default: getInputClasses("default", inputOptions),
                town: getInputClasses("town", inputOptions)
            }[this.variant];
        }
    },
    components: {
        InputError,
        InputIcon
    }
};
</script>
