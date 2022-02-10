<template>
    <ValidationProvider
        ref="provider"
        :rules="rules"
        :name="validationName || label"
        v-slot="{ errors }"
        :vid="id"
    >
        <InputWrapper :hasErrors="!!errors.length">
            <InputLabel
                :label="label"
                :info="info"
                :showMandatoryStar="showMandatoryStar"
                :id="id"
            />
            <div class="relative" :class="width">
                <InputIcon
                    position="before"
                    icon="calendar"
                    class="z-10 text-G400"
                />

                <component
                    :is="dynamicComponent"
                    :input-class="inputClasses"
                    v-bind="$attrs"
                    v-on="$listeners"
                    :language="dateLanguage"
                    :monday-first="true"
                    :data-cy-field="cypressName"
                    ref="datepicker"
                ></component>

                <InputIcon
                    position="after"
                    icon="times"
                    class="text-primary text-display-sm cursor-pointer"
                    @click.native="clear"
                    v-if="$attrs.value"
                    data-cy-button="clear"
                />
            </div>
            <InputError>{{ errors[0] }}</InputError>
        </InputWrapper>
    </ValidationProvider>
</template>

<script>
import { fr } from "vuejs-datepicker/dist/locale";
import getInputClasses from "./Form/utils/getInputClasses";
import InputLabel from "./Form/utils/InputLabel.vue";
import InputIcon from "./Form/utils/InputIcon.vue";
import InputWrapper from "./Form/utils/InputWrapper.vue";
import InputInfo from "./Form/utils/InputInfo.vue";
import InputError from "./Form/utils/InputError.vue";

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
            type: String
        },
        variant: {
            type: String,
            default: "default"
        },
        rules: {
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
        width: {
            type: String,
            required: false
        }
    },
    components: {
        InputLabel,
        InputWrapper,
        InputError,
        InputInfo,
        InputIcon
    },
    data() {
        return {
            dateLanguage: fr,
            dynamicComponent: null
        };
    },
    mounted() {
        // Make vuejs-datepicker friendly with SSR
        import("vuejs-datepicker").then(module => {
            this.dynamicComponent = module.default;
        });
    },
    computed: {
        inputClasses() {
            const inputOptions = {
                error: this.error,
                prefixIcon: this.variant === "default"
            };

            return {
                state: [...getInputClasses("state", inputOptions)],
                default: getInputClasses("default", inputOptions),
                town: getInputClasses("town", inputOptions)
            }[this.variant];
        }
    },
    methods: {
        clear() {
            this.$refs.datepicker.clearDate();
        }
    }
};
</script>
