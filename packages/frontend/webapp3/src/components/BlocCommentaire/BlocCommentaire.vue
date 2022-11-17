<template>
    <div
        class="border-t-1 border-G400 py-4"
        @mouseenter="isHover = true"
        @mouseleave="isHover = false"
    >
        <div class="flex justify-between">
            <div class="text-G600 text-sm mb-1">
                {{ formatDate(comment.createdAt, "d M y à h:i") }}
            </div>
            <span
                class="text-red font-bold cursor-pointer"
                v-if="showActionIcons && (isOwner || (canModerate && isHover))"
                @click="deleteMessage"
                >Supprimer {{ isOwner ? "mon" : "le" }} message
                <Icon icon="fa-trash-alt" alt="Supprimer le message"
            /></span>
        </div>
        <div
            class="text-G600 text-sm mb-1"
            v-if="comment.covid && comment.covid.date"
        >
            Date de l'intervention:
            {{ formatDate(comment.covid.date, "d M y à h:i") }}
        </div>
        <div
            v-if="
                comment.user_target_name.length > 0 ||
                comment.organization_target_name.length > 0
            "
        >
            <Icon icon="lock" class="text-red" />
            <span class="pl-1 font-bold"
                >Message réservé aux structures et utilisateurs suivants :</span
            >
            <div v-for="user in comment.user_target_name" :key="user">
                - {{ user }}
            </div>
            <div
                v-for="organization in comment.organization_target_name"
                :key="organization"
            >
                - {{ organization }}
            </div>
        </div>
        <div class="text-primary font-bold mb-1 mt-2">
            <router-link :to="`/annuaire/${comment.createdBy.organization_id}`">
                <Icon icon="user" /> {{ comment.createdBy.first_name }}
                {{ comment.createdBy.last_name }} -
                {{ comment.createdBy.organization }}
            </router-link>
        </div>
        <div class="ml-5">
            <div class="flex flex-wrap">
                <Tag
                    v-if="!!comment.covid"
                    variant="withoutBackground"
                    :class="['inline-block', 'bg-red', 'text-white']"
                    >Covid-19</Tag
                >
                <TagCommentaireCovid
                    v-for="tag in covidTags"
                    :key="tag.prop"
                    :class="['mr-2', 'mb-2']"
                    :tag="tag"
                />
                <TagCommentaireStandard
                    v-for="(tag, index) in comment.tags"
                    :key="index"
                    :class="['mr-2', 'mb-2']"
                    :tag="tag"
                />
            </div>
            <div class="whitespace-pre-line">{{ comment.description }}</div>
        </div>
    </div>
</template>
<script setup>
import { defineProps, toRefs, ref, computed } from "vue";
import formatDate from "@/utils/formatDate";
import { Icon, Tag } from "@resorptionbidonvilles/ui";
import TagCommentaireStandard from "@/components/TagCommentaireStandard/TagCommentaireStandard.vue";
import TagCommentaireCovid from "@/components/TagCommentaireCovid/TagCommentaireCovid.vue";
import { useConfigStore } from "@/stores/config.store";
import { useUserStore } from "@/stores/user.store";

const configStore = useConfigStore();
const userStore = useUserStore();

const props = defineProps({
    comment: {
        type: Object,
    },
    showActionIcons: {
        type: Boolean,
        default: false,
    },
});

const isHover = ref(false);

const { comment, showActionIcons } = toRefs(props);

const covidTags = computed(() => {
    if (!comment.value || !comment.value.covid) {
        return [];
    }

    return covidTags.value.filter((t) => {
        return !!comment.value.covid[t.prop];
    });
});

const isOwner = computed(() => {
    return comment.value.createdBy.id === configStore.config.user.id;
});
const canModerate = computed(() => {
    return userStore.hasPermission("shantytown_comment.moderate");
});

function deleteMessage() {
    // TODO
}
</script>
