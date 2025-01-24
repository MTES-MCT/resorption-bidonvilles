<template>
    <form>
        <Layout v-bind="$attrs">
            <template v-slot:banner>
                <section class="py-12">
                    <ContentWrapper
                        class="flex flex-wrap justify-between items-center gap-2"
                        :size="size"
                    >
                        <div class="flex items-center space-x-3">
                            <slot name="icon" />
                            <div>
                                <h1 class="text-2xl font-bold">
                                    <slot name="title" />
                                </h1>
                                <h2 v-if="$slots.subtitle">
                                    <slot name="subtitle" />
                                </h2>
                            </div>
                        </div>
                        <div class="flex space-x-3">
                            <slot name="buttons" />
                        </div>
                    </ContentWrapper>
                </section>
            </template>

            <slot />

            <ContentWrapper
                class="mt-12 flex justify-end space-x-3"
                :size="size"
            >
                <slot name="buttons" />
            </ContentWrapper>
        </Layout>
    </form>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import Layout from "@/components/Layout/Layout.vue";
import { ContentWrapper } from "@resorptionbidonvilles/ui";

const props = defineProps({
    size: {
        type: String,
        required: false,
        default: "medium",
    },
});
const { size } = toRefs(props);
</script>
