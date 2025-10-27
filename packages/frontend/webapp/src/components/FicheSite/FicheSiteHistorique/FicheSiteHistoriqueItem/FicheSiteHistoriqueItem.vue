<template>
    <section class="py-4 border-b border-b-G400">
        <LinkOrganization :to="`/structure/${author.organization.id}`">
            {{ author.first_name }}
            {{ author.last_name }} -
            {{ author.organization.abbreviation || author.organization.name }}
        </LinkOrganization>
        <p class="text-sm text-G700">
            le {{ formatDate(date, "d M y à h:i") }}
        </p>

        <div class="my-2 flex flex-col space-y-2">
            <p v-if="$slots.default" class="text-green700"><slot /></p>

            <article v-else v-for="item in diff" :key="item.field">
                <p class="text-green700">{{ item.field }}</p>
                <p
                    v-if="item.fieldKey !== 'updatedWithoutAnyChange'"
                    class="break-words whitespace-pre-wrap"
                >
                    <template
                        v-if="
                            item.fieldKey ===
                                'preparatoryPhasesTowardResorption' &&
                            item.newValue &&
                            item.newValue.includes('|||')
                        "
                    >
                        <!-- Gérer l'affichage spécial pour les phases avec correspondance -->
                        <template
                            v-for="(newVal, index) in item.newValue.split(
                                '|||'
                            )"
                            :key="index"
                        >
                            <span v-if="index > 0"><br /></span>
                            <span>{{ newVal }}</span>
                            <template
                                v-if="
                                    item.oldValue &&
                                    item.oldValue.split('|||')[index] &&
                                    item.oldValue.split('|||')[index].trim() !==
                                        ''
                                "
                            >
                                <span>, </span>
                                <span
                                    class="line-through text-G700 hover:text-G700"
                                    >{{
                                        item.oldValue.split("|||")[index]
                                    }}</span
                                >
                            </template>
                        </template>
                    </template>
                    <template v-else-if="item.fieldKey === 'owner'">
                        <!-- Gérer l'affichage spécial pour les propriétaires -->
                        <template
                            v-for="(newVal, index) in item.newValue"
                            :key="index"
                        >
                            {{ newVal }}
                            <!-- <span>
                                {{ newValue.typeDetails?.label }} -
                                {{ newValue.name }}
                            </span> -->
                        </template>
                        <template
                            v-if="
                                item.oldValue?.name &&
                                ![
                                    'non renseignées',
                                    'non renseigné',
                                    'non renseignés',
                                ].includes(item.oldValue.name.trim())
                            "
                        >
                            <span>, </span>
                            <span
                                class="line-through text-G700 hover:text-G700"
                                >{{
                                    item.oldValue.ownerType +
                                    " - " +
                                    item.oldValue.ownerName
                                }}</span
                            >
                        </template>
                    </template>
                    <template v-else>
                        <span> {{ item.newValue || "non renseigné" }}</span>
                        <template
                            v-if="
                                item.oldValue &&
                                typeof item.oldValue === 'string' &&
                                ![
                                    'non renseignées',
                                    'non renseigné',
                                    'non renseignés',
                                ].includes(item.oldValue.trim())
                            "
                        >
                            <span>, </span>
                            <span class="line-through text-G700 hover:text-G700"
                                >{{ item.oldValue }}
                            </span>
                        </template>
                    </template>
                </p>
            </article>
        </div>
    </section>
</template>

<script setup>
import { toRefs } from "vue";
import formatDate from "@common/utils/formatDate.js";
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
</script>
