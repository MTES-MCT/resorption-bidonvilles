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
        <div class="ml-4">
            <div v-if="comments" :data-cy-data="cypressComments">
                {{ comments }}
            </div>
            <div
                v-if="
                    details &&
                        (details.negative.length || details.positive.length)
                "
                class="border border-primary rounded px-8 mt-4"
            >
                <div class="border-b-2 border-G200 py-2 font-bold text-primary">
                    Détail:
                    <span v-if="details.negative.length"
                        >{{ details.negative.length }} action{{
                            details.negative.length > 1 ? "s" : ""
                        }}
                        pour améliorer l'accès</span
                    >
                </div>
                <div>
                    <TownDetailsPanelLivingConditionsDetails
                        type="negative"
                        :data-cy-data="cypressDetailsPrefix + '_negative'"
                        :details="details.negative"
                    />
                    <TownDetailsPanelLivingConditionsDetails
                        type="positive"
                        :data-cy-data="cypressName + '_positive'"
                        :details="details.positive"
                    />
                </div>
            </div>
        </div>
    </TownDetailsPanelSection>
</template>

<script>
import TownDetailsPanelSection from "./TownDetailsPanelSection";
import TownDetailsPanelLivingConditionsDetails from "./TownDetailsPanelLivingConditionsDetails";
export default {
    components: {
        TownDetailsPanelLivingConditionsDetails,
        TownDetailsPanelSection
    },
    props: {
        title: {
            type: String
        },
        value: {
            validator: prop => typeof prop === "boolean" || prop === null
        },
        cypressName: {
            type: String
        },
        cypressComments: {
            type: String
        },
        cypressDetailsPrefix: {
            type: String
        },
        comments: {
            type: String
        },
        details: {
            type: Array
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
