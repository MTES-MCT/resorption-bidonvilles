<template>
    <DetailsPanelSection>
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
                    status.negative.length ||
                        status.positive.length ||
                        status.unknown.length
                "
                class="border-1 border-cardBorder rounded px-8 mt-4"
            >
                <div
                    class="border-b-2 border-G200 py-2 font-bold text-primary flex items-center justify-between"
                >
                    <div>
                        <span v-if="status.negative.length">
                            {{ status.negative.length }} action{{
                                status.negative.length > 1 ? "s" : ""
                            }}
                            pour améliorer l'accès
                        </span>
                        <span v-else-if="status.positive.length">
                            {{ status.positive.length }} action{{
                                status.positive.length > 1 ? "s" : ""
                            }}
                            pour entretenir l'accès
                        </span>
                        <span
                            v-if="
                                status.unknown.length &&
                                    (status.negative.length ||
                                        status.positive.length)
                            "
                            >et</span
                        >
                        <span v-if="status.unknown.length">
                            {{ status.unknown.length }} information{{
                                status.unknown.length > 1 ? "s" : ""
                            }}
                            non renseignée{{
                                status.unknown.length > 1 ? "s" : ""
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
                        :details="status.negative"
                    />
                    <TownDetailsPanelLivingConditionsDetails
                        type="positive"
                        :cypressName="
                            cypressDetailsPrefix + '_details_positive'
                        "
                        :details="status.positive"
                    />
                    <TownDetailsPanelLivingConditionsDetails
                        type="unknown"
                        :cypressName="cypressDetailsPrefix + '_details_unknown'"
                        :details="status.unknown"
                    />
                </div>
            </div>
        </div>
    </DetailsPanelSection>
</template>

<script>
import DetailsPanelSection from "#app/components/ui/details/DetailsPanelSection.vue";
import TownDetailsPanelLivingConditionsDetails from "./TownDetailsPanelLivingConditionsDetails";
export default {
    components: {
        TownDetailsPanelLivingConditionsDetails,
        DetailsPanelSection
    },
    props: {
        title: {
            type: String
        },
        status: {
            type: Object
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
        inverted: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            colors: {
                good: "text-green500",
                toImprove: "text-secondary",
                bad: "text-red",
                unknown: "text-red"
            },
            icons: {
                good: "check",
                toImprove: "exclamation-triangle",
                bad: "times",
                unknown: "question"
            },
            texts: {
                good: "oui",
                toImprove: "à améliorer",
                bad: "non",
                unknown: "inconnu"
            },
            collapsed: true
        };
    },
    methods: {
        collapse() {
            this.collapsed = !this.collapsed;
        }
    },
    computed: {
        colorClass() {
            return this.colors[this.status.status] || "text-red";
        },
        icon() {
            return this.icons[this.status.status] || "question";
        },
        text() {
            let status = this.status.status;
            if (this.inverted === true) {
                if (status === "good") {
                    status = "bad";
                } else if (status === "bad") {
                    status = "good";
                }
            }

            return this.texts[status] || "inconnu";
        }
    }
};
</script>
