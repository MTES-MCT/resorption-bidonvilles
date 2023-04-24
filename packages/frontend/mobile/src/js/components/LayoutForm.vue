<template>
    <div class="h-full">
        <form class="h-full">
            <Layout>
                <template v-slot:header>
                    <header>
                        <div
                            class="bg-G200 text-display-sm font-bold text-center pt-3 pb-2"
                            style="line-height: 1em"
                        >
                            <slot name="title" />

                            <br />
                            <Button
                                icon="arrow-left"
                                iconPosition="left"
                                size="sm"
                                variant="textPrimary"
                                class="text-primary"
                                type="button"
                                @click="router.push(backUrl)"
                            >
                                <slot name="back" />
                            </Button>
                        </div>
                        <div class="text-center py-2">
                            <Button
                                type="button"
                                variant="primary"
                                @click="submit"
                            >
                                <slot name="validate" />
                            </Button>
                        </div>
                    </header>
                </template>
                <template v-slot:scroll>
                    <slot name="scroll" />
                </template>
            </Layout>
        </form>
    </div>
</template>

<script setup>
import { toRefs } from "vue";
import router from "../router";
import { useEventBus } from "#frontend/common/helpers/event-bus";

import { Button } from "@resorptionbidonvilles/ui";
import Layout from "#src/js/components/Layout.vue";

const props = defineProps({
    backUrl: {
        type: String,
        required: true,
    },
});
const { backUrl } = toRefs(props);

const { emit } = useEventBus();

function submit() {
    emit("validateForm:submit");
}
</script>
