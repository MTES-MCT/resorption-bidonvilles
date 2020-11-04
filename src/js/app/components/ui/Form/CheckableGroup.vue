<template>
    <ValidationProvider
        :rules="rules"
        :name="validationName || title"
        v-slot="{ errors }"
        :vid="id"
    >
        <CheckableGroupWrapper :title="title" :info="info" :id="id">
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
            <InputError>{{ errors[0] }}</InputError>
        </CheckableGroupWrapper>
    </ValidationProvider>
</template>

<script>
import InputError from "./utils/InputError.vue";
import CheckableGroupWrapper from "./utils/CheckableGroupWrapper.vue";

export default {
    props: {
        title: {
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
        }
    },
    components: {
        CheckableGroupWrapper,
        InputError
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
    .checkbox-default,
    .checkbox-card,
    .radio-default,
    .radio-card {
        &:last-child {
            @apply mr-0 mb-0;
        }

        @apply mr-4 mb-2;
    }
}

.checkableGroup--verticalLayout {
    .checkbox-default,
    ,
    .radio-default,
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
