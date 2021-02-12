<template>
    <ValidationProvider
        :rules="rules"
        :name="validationName || label"
        v-slot="{ errors }"
        :vid="id"
    >
        <InputWrapper :withoutMargin="withoutMargin">
            <InputLabel
                :label="label"
                :info="info"
                :id="id"
                :showMandatoryStar="showMandatoryStar"
            />

            <div :class="'flex flex-col relative'">
                <div v-if="error" class="absolute h-full bg-error leftBorder" />
                <div
                    :class="[
                        'flex',
                        direction === 'vertical'
                            ? 'flex-col checkableGroup--verticalLayout'
                            : 'flex-row flex-wrap checkableGroup--horizontalLayout'
                    ]"
                >
                    <slot />
                </div>
            </div>
            <InputError v-if="errors[0]">{{ errors[0] }}</InputError>
        </InputWrapper>
    </ValidationProvider>
</template>

<script>
import InputError from "./utils/InputError.vue";
import InputLabel from "./utils/InputLabel.vue";
import InputWrapper from "./utils/InputWrapper.vue";

export default {
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
        direction: {
            type: String,
            default: "vertical"
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
        withoutMargin: {
            required: false,
            type: Boolean,
            default: false
        },
        showMandatoryStar: {
            required: false,
            type: Boolean,
            default: false
        }
    },
    components: {
        InputError,
        InputLabel,
        InputWrapper
    }
};
</script>

<style scoped>
.leftBorder {
    width: 2px;
    left: -16px;
}
</style>

<style lang="scss">
.checkableGroup--horizontalLayout {
    .checkbox-card,
    .radio-card {
        @apply mr-1 mb-1;

        &:last-child {
            @apply mr-0;
        }
    }

    .checkbox-default,
    .radio-default {
        &:last-child {
            @apply mr-0 mb-0;
        }

        @apply mr-4;
    }
}

.checkableGroup--verticalLayout {
    .radio-card {
        &:last-child {
            @apply mb-0;
        }

        @apply mb-6;
    }

    .checkbox-card,
    .radio-card {
        @apply mb-2;
    }
}
</style>
