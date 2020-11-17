<template>
    <TownDetailsPanelSection>
        <div class="flex">
            <Icon :class="colorClass" :icon="icon" />
            <div>
                <div class="flex items-center">
                    <div class="font-bold">{{ title }} :</div>
                    <div :class="colorClass">{{ text }}</div>
                </div>
                <slot />
            </div>
        </div>
    </TownDetailsPanelSection>
</template>

<script>
import TownDetailsPanelSection from "./TownDetailsPanelSection";
export default {
    components: { TownDetailsPanelSection },
    props: {
        title: {
            type: String
        },
        value: {
            validator: prop => typeof prop === "boolean" || prop === null
        }
    },
    computed: {
        colorClass() {
            return {
                null: "text-G500",
                false: "text-red",
                true: "text-green"
            }[this.value];
        },
        icon() {
            return {
                null: "question",
                false: "times",
                true: "check"
            }[this.value];
        },
        text() {
            return {
                null: "inconnu",
                false: "non",
                true: "oui"
            }[this.value];
        }
    }
};
</script>
