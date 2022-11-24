<template>
    <form>
        <Layout v-bind="$attrs">
            <template v-slot:banner>
                <section class="py-12">
                    <ContentWrapper
                        class="flex justify-between items-center"
                        size="intermediate"
                    >
                        <p>
                            <h1 class="text-2xl font-bold">
                                <slot name="title" />
                            </h1>
                            <h2 v-if="$slots.subtitle"><slot name="subtitle" /></h2>
                        </p>
                        <div class="flex space-x-3">
                            <slot name="buttons" />
                        </div>
                    </ContentWrapper>
                </section>
            </template>

            <slot />

            <ContentWrapper
                class="mt-12 flex justify-end space-x-3"
                size="intermediate"
            >
                <slot name="buttons" />
            </ContentWrapper>
        </Layout>
    </form>
</template>

<script setup>
import Layout from "@/components/Layout/Layout.vue";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";
</script>
