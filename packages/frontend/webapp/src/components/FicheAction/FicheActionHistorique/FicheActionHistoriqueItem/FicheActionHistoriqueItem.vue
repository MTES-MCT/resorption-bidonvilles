<template>
    <section class="py-4 border-b border-b-G400">
        <LinkOrganization :to="`/structure/${author.organization.id}`">
            {{ formattedAuthorName }} -
            {{ author.organization.abbreviation || author.organization.name }}
        </LinkOrganization>
        <p class="text-sm text-G700">
            le {{ formatTimestamp(date, "d M y à h:i") }}
        </p>

        <div class="my-2 flex flex-col space-y-2">
            <p v-if="$slots.default" class="text-green700"><slot /></p>

            <article v-else v-for="item in diff" :key="item.field">
                <p class="text-green700">{{ item.field }}</p>
                <p class="break-words whitespace-pre-wrap">
                    {{ item.newValue || "non renseigné" }}
                </p>
                <p
                    v-if="
                        item.oldValue &&
                        typeof item.oldValue === 'string' &&
                        ![
                            'non renseignées',
                            'non renseigné',
                            'non renseignés',
                        ].includes(item.oldValue.trim())
                    "
                    class="break-words whitespace-pre-wrap line-through text-G700 hover:text-G700"
                >
                    {{ item.oldValue }}
                </p>
            </article>
        </div>
    </section>
</template>

<script setup>
import { toRefs, computed } from "vue";
import formatTimestamp from "@common/utils/formatTimestamp.js";
import { LinkOrganization } from "@resorptionbidonvilles/ui";

const props = defineProps({
    author: Object,
    date: [String, Number],
    diff: {
        type: Array,
        required: false,
        default() {
            return [];
        },
    },
});
const { author, date, diff } = toRefs(props);

const formatFirstName = (firstName) => {
    if (!firstName) {
        return "";
    }

    // Gérer les prénoms composés séparés par "-" ou " "
    return firstName
        .split(/([- ])/)
        .map((part) => {
            // Garder les séparateurs tels quels
            if (part === "-" || part === " ") {
                return part;
            }

            // Capitaliser la première lettre, le reste en minuscules
            return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
        })
        .join("");
};

const formattedAuthorName = computed(() => {
    if (!author.value) {
        return "";
    }

    const firstName = formatFirstName(author.value.first_name);
    const lastName = author.value.last_name?.toUpperCase() || "";

    return `${firstName} ${lastName}`;
});
</script>
