<template>
    <p class="inline-block" v-if="lastEvent">
        <RouterLink
            v-if="lastEvent.type === 'comment'"
            :to="`/site/${town.id}#journal_du_site`"
        >
            <span class="font-semibold text-primary">
                {{ lastEvent.data }}
            </span>
            <span> le {{ formatDate(lastEvent.date, "d M y à h:i") }}</span>
        </RouterLink>
        <template v-else>
            <span class="font-semibold text-primary">
                {{ lastEvent.data }}
            </span>
            <span> le {{ formatDate(lastEvent.date, "d M y à h:i") }}</span>
        </template>
    </p>
</template>
<script setup>
import { computed, toRefs } from "vue";
import { RouterLink } from "vue-router";
import formatDate from "@common/utils/formatDate";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);

function getEventCategory(fieldKey) {
    const categories = {
        characteristics: [
            "name",
            "builtAt",
            "declaredAt",
            "addressSimple",
            "addressDetails",
            "fieldType",
            "ownerType",
            "owner",
        ],
        inhabitants: [
            "minorsInSchool",
            "caravans",
            "huts",
            "tents",
            "cars",
            "mattresses",
            "isReinstallation",
            "reinstallationComments",
            "censusStatus",
            "censusConductedAt",
            "censusConductedBy",
            "socialOrigins",
        ],
        procedures: [
            "ownerComplaint",
            "justiceProcedure",
            "justiceRendered",
            "justiceRenderedAt",
            "justiceRenderedBy",
            "justiceChallenged",
            "policeStatus",
            "policeRequestedAt",
            "policeGrantedAt",
            "bailiff",
            "existingLitigation",
            "evacuationUnderTimeLimit",
            "administrativeOrderDecisionAt",
            "administrativeOrderDecisionRenderedBy",
            "administrativeOrderEvacuationAt",
            "insalubrityOrder",
            "insalubrityOrderDisplayed",
            "insalubrityOrderType",
            "insalubrityOrderBy",
            "insalubrityOrderAt",
            "insalubrityParcels",
        ],
        location: ["latitude", "longitude"],
    };

    if (categories.characteristics.includes(fieldKey)) {
        return "Caractéristiques du site";
    }
    if (
        categories.inhabitants.includes(fieldKey) ||
        fieldKey.startsWith("population")
    ) {
        return "Habitants";
    }
    if (fieldKey.startsWith("livingConditions")) {
        return "Conditions de vie";
    }
    if (categories.procedures.includes(fieldKey)) {
        return "Procédures";
    }
    if (categories.location.includes(fieldKey)) {
        return "Localisation";
    }

    return "Informations";
}

function getLatestEvent(townEvents, comments) {
    const normalizedEvents = townEvents.map((townEvent) => {
        if (!townEvent.diff || townEvent.diff.length === 0) {
            return {
                type: "townEvent",
                data: "Mise à jour des informations",
                date: new Date(townEvent.date),
            };
        }

        const categories = [...new Set(
                townEvent.diff.map((diff) => getEventCategory(diff.fieldKey))
            ),
        ];

        return {
            type: "townEvent",
            data:
                categories.length === 1
                    ? `Mise à jour de la rubrique "${categories[0]}"`
                    : `Mise à jour des rubriques : "${categories
                          .map((c) => c)
                          .join(", ")}"`,
            date: new Date(townEvent.date),
        };
    });

    const normalizedComments = comments.map((comment) => ({
        type: "comment",
        data: "Message dans le journal du site",
        date: new Date(comment.createdAt),
    }));

    const allEvents = [...normalizedEvents, ...normalizedComments];

    if (allEvents.length === 0) {
        return null;
    }

    return allEvents.reduce((latest, current) => {
        return current.date > latest.date ? current : latest;
    }, allEvents[0]);
}

const lastEvent = computed(() => {
    return getLatestEvent(town.value.changelog, town.value.comments);
});
</script>
