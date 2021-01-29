<template>
    <TownDetailsPanelSection>
        <div class="flex items-center">
            <Icon :class="[colorClass, 'mr-1', 'font-bold']" :icon="icon" />
            <div>
                <div class="flex items-center">
                    <div :class="[colorClass, 'font-bold', 'mr-1']">
                        {{ title }} :
                    </div>
                    <div :data-cy-data="cypressName">{{ text }}</div>
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
        },
        cypressName: {
            type: String
        }
    },
    computed: {
        colorClass() {
            if (this.value === true) {
                return "text-green";
            }

            return "text-red";
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
