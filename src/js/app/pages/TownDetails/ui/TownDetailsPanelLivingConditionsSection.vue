<template>
    <TownDetailsPanelSection>
        <div :class="[colorClass, 'flex items-center']">
            <Icon :class="['mr-1', 'font-bold']" :icon="icon" />
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
                    this.value &&
                        details &&
                        (details.negative.length ||
                            details.positive.length ||
                            details.unknown.length)
                "
                class="border border-primary rounded px-8 mt-4"
            >
                <div
                    class="border-b-2 border-G200 py-2 font-bold text-primary flex items-center justify-between"
                >
                    <div>
                        <span v-if="details.negative.length">
                            {{ details.negative.length }} action{{
                                details.negative.length > 1 ? "s" : ""
                            }}
                            pour améliorer l'accès
                        </span>
                        <span v-else-if="details.positive.length">
                            {{ details.positive.length }} action{{
                                details.positive.length > 1 ? "s" : ""
                            }}
                            pour entretenir l'accès
                        </span>
                        <span
                            v-if="
                                details.unknown.length &&
                                    (details.negative.length ||
                                        details.positive.length)
                            "
                            >et</span
                        >
                        <span v-if="details.unknown.length">
                            {{ details.unknown.length }} information{{
                                details.unknown.length > 1 ? "s" : ""
                            }}
                            non renseignée{{
                                details.unknown.length > 1 ? "s" : ""
                            }}
                        </span>
                    </div>
                    <div>
                        <Button
                            :icon="collapsed ? 'chevron-up' : 'chevron-down'"
                            variant="primaryText"
                            @click="collapse"
                        />
                    </div>
                </div>

                <div v-if="!collapsed">
                    <TownDetailsPanelLivingConditionsDetails
                        type="negative"
                        :cypressName="
                            cypressDetailsPrefix + '_details_negative'
                        "
                        :details="details.negative"
                    />
                    <TownDetailsPanelLivingConditionsDetails
                        type="positive"
                        :cypressName="
                            cypressDetailsPrefix + '_details_positive'
                        "
                        :details="details.positive"
                    />
                    <TownDetailsPanelLivingConditionsDetails
                        type="unknown"
                        :cypressName="cypressDetailsPrefix + '_details_unknown'"
                        :details="details.unknown"
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
        },
        inverted: {
            type: Boolean
        }
    },
    data() {
        return {
            collapsed: false
        };
    },
    methods: {
        collapse() {
            this.collapsed = !this.collapsed;
        }
    },
    computed: {
        colorClass() {
            if (
                this.value &&
                this.details &&
                this.details.negative.length > 0
            ) {
                return "text-secondary";
            }

            if (
                (this.value === true && !this.inverted) ||
                (this.value === false && this.inverted)
            ) {
                return "text-green";
            }

            return "text-red";
        },
        icon() {
            if (
                this.value &&
                this.details &&
                this.details.negative.length > 0
            ) {
                return "exclamation-triangle";
            }

            return {
                null: "question",
                false: this.inverted ? "check" : "times",
                true: this.inverted ? "times" : "check"
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
