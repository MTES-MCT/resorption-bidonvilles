<template>
    <Field :id="id" :name="id" v-slot="{ field, errors }">
        <InputWrapper :hasErrors="!!errors.length">
            <InputLabel :label="label" :info="info" :showMandatoryStar="showMandatoryStar" />

            <div class="relative">
                <InputIcon position="before" :icon="prefixIcon" v-if="prefixIcon" />
                <textarea ref="textarea" @input="$emit('input', $event.target.value)"
                    v-bind="{ ...field, ...filteredProps }" :class="classes" :data-cy-field="cypressName"
                    :disabled="isSubmitting || disabled" :readonly="isSubmitting || disabled" @focus="onFocus"
                    @blur="onBlur" />
                <InputIcon position="after" :icon="suffixIcon" v-if="suffixIcon" />
            </div>
            <div class="-mt-3">
                <div class="bg-G300 p-2">
                    <Button icon="paperclip" iconPosition="left" size="sm" variant="primaryText">Joindre un
                        document</Button>
                </div>
                <div class="mt-2 grid grid-cols-3 items-end">
                    <div class="border p-2 rounded flex items-center space-x-2 text-sm mr-2">
                        <div class="w-10 h-10 bg-G400 rounded"></div>
                        <p class="flex-1 relative">
                        <div class="absolute right-0"><Button icon="trash-alt" size="sm" /></div>
                        Nom du fichier origi...<br />
                        <span class="text-G500">PNG 206Ko</span>
                        </p>
                    </div>
                    <div class="border p-2 rounded flex items-center space-x-2 text-sm mr-2">
                        <div class="w-10 h-10 bg-G400 rounded"></div>
                        <p class="flex-1 relative">
                        <div class="absolute right-0"><Button icon="trash-alt" size="sm" /></div>
                        Nom du fichier origi...<br />
                        <span class="text-G500">PNG 206Ko</span>
                        </p>
                    </div>
                    <div class="border p-2 rounded flex items-center space-x-2 text-sm mr-2">
                        <div class="w-10 h-10 bg-G400 rounded"></div>
                        <p class="flex-1 relative">
                        <div class="absolute right-0"><Button icon="trash-alt" size="sm" /></div>
                        Nom du fichier origi...<br />
                        <span class="text-G500">PNG 206Ko</span>
                        </p>
                    </div>
                    <div class="border p-2 rounded flex items-center space-x-2 text-sm mr-2 mt-2">
                        <div class="w-10 h-10 bg-G400 rounded"></div>
                        <p class="flex-1 relative">
                        <div class="absolute right-0"><Button icon="trash-alt" size="sm" /></div>
                        Nom du fichier origi...<br />
                        <span class="text-G500">PNG 206Ko</span>
                        </p>
                    </div>
                </div>
            </div>
            <InputError>{{ errors[0] }}</InputError>
        </InputWrapper>
    </Field>
</template>

<script>
import { Field, useIsSubmitting } from "vee-validate";
import { Button, Icon } from "@resorptionbidonvilles/ui";

import filteredProps from "./mixins/filteredProps";
import InputLabel from "./utils/InputLabel.vue";
import InputWrapper from "./utils/InputWrapper.vue";
import InputError from "./utils/InputError.vue";
import InputIcon from "./utils/InputIcon.vue";
import getInputClasses from "./utils/getInputClasses";

export default {
    name: "TextArea",
    mixins: [filteredProps],
    setup() {
        const isSubmitting = useIsSubmitting();
        return {
            isSubmitting,
        };
    },
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
            default: "text"
        },
        value: {
            type: String
        },
        rules: {
            type: String
        },
        validationName: {
            type: String
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
        rows: {
            type: [String, Number]
        },
        cols: {
            type: String
        },
        cypressName: {
            type: String
        },
        showMandatoryStar: {
            required: false,
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isFocused: false,
        };
    },
    computed: {
        classes() {
            const inputOptions = {
                // error: !!this.errors?.length,
                prefixIcon: this.prefixIcon,
                suffixIcon: this.suffixIcon
            };

            return {
                state: [...getInputClasses("state", inputOptions)],
                default: getInputClasses("default", inputOptions)
            }[this.variant];
        }
    },
    methods: {
        onFocus() {
            this.isFocused = true;
        },
        onBlur() {
            this.isFocused = false;
        },
        focus() {
            this.$refs.textarea.focus();
        },
    },
    components: {
        InputLabel,
        InputWrapper,
        InputError,
        InputIcon,
        Field,
        Icon,
        Button
    }
};
</script>
