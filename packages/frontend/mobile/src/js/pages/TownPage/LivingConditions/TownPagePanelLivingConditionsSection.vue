<template>
    <div class="py-2">
        <div :class="[colorClass, 'flex items-center']">
            <Icon :class="['mr-1', 'font-bold']" :icon="icon" />
            <div>
                <div class="flex items-center">
                    <div :class="[colorClass, 'font-bold', 'mr-1']">
                        {{ title }}<span v-if="showStatus"> :</span>
                    </div>
                    <div v-if="showStatus">
                        {{ text }}
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-6" v-if="answers.length">
            <div v-for="answer in answers" :key="answer.label">
                <TownPageInfo :title="answer.label">
                    <p>{{ answer.content }}</p>
                </TownPageInfo>
            </div>
        </div>
        <TownPageLivingConditionsDetails :status="status" />
    </div>
</template>

<script>
import { Icon } from "@resorptionbidonvilles/ui";
import TownPageInfo from "../TownPageInfo.vue";
import TownPageLivingConditionsDetails from "./TownPageLivingConditionsDetails.vue";

export default {
    props: {
        title: {
            type: String,
        },
        status: {
            type: Object,
        },
        showStatus: {
            type: Boolean,
            default: true,
            required: false,
        },
        answers: {
            type: Array,
            default() {
                return [];
            },
        },
        inverted: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            colors: {
                good: "text-green500",
                toImprove: "text-secondary",
                bad: "text-red",
                unknown: "text-red",
            },
            icons: {
                good: "check",
                toImprove: "exclamation-triangle",
                bad: "times",
                unknown: "question",
            },
            texts: {
                good: "oui",
                toImprove: "à améliorer",
                bad: "non",
                unknown: "inconnu",
            },
            collapsed: true,
        };
    },
    components: {
        Icon,
        TownPageLivingConditionsDetails,
        TownPageInfo,
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
        },
    },
};
</script>
