<template>
    <div
        class="border-t-1 border-G400 py-4"
        @mouseenter="isHover = true"
        @mouseleave="isHover = false"
    >
        <div class="flex justify-between">
            <div class="text-G700 text-sm mb-1">
                {{ formatTimestamp(comment.createdAt, "d M y à h:i") }}
            </div>
            <div>
                <DsfrButtonGroup
                    size="sm"
                    :buttons="buttons"
                    inlineLayoutWhen="always"
                    iconRight="true"
                />
            </div>
        </div>
        <div
            v-if="
                comment.user_target_name?.length > 0 ||
                comment.organization_target_name?.length > 0
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
            <LinkOrganization
                :to="`/structure/${comment.createdBy.organization_id}`"
            >
                {{ comment.createdBy.first_name }}
                {{ comment.createdBy.last_name }} -
                {{ comment.createdBy.organization }}
            </LinkOrganization>
        </div>
        <div class="mt-2 flex flex-wrap">
            <TagCommentaire
                v-for="(tag, index) in comment.tags"
                :key="index"
                class="mr-2 mb-2"
                :tag="tag"
            />
        </div>
        <FilePreviewList
            v-if="comment.attachments?.length > 0"
            class="mb-2"
            :files="comment.attachments"
            :allowDeletion="allowAttachmentDeletion && (isOwner || canModerate)"
            @deleteFile="(file, index) => emit('deleteAttachment', file, index)"
        />
        <div v-if="!isEditing" class="whitespace-pre-line break-words">
            {{ comment.description }}
        </div>
        <div v-else class="mt-2">
            <label
                :for="`comment-edit-${comment.id}`"
                class="block text-sm font-bold mb-1"
                >Modifier le message</label
            >
            <DsfrInput
                :id="`comment-edit-${comment.id}`"
                v-model="editedDescription"
                isTextarea="true"
                :rows="3"
            />
            <div v-if="editError" class="text-red text-sm mt-1">
                {{ editError }}
            </div>
            <div class="flex gap-2 mt-2">
                <DsfrButtonGroup
                    size="sm"
                    :buttons="editingButtons"
                    inlineLayoutWhen="always"
                    iconRight="true"
                />
            </div>
        </div>
    </div>
</template>
<script setup>
import { toRefs, ref, computed } from "vue";
import { useConfigStore } from "@/stores/config.store";
import { useUserStore } from "@/stores/user.store";
import formatTimestamp from "@common/utils/formatTimestamp.js";

import {
    FilePreviewList,
    Icon,
    LinkOrganization,
} from "@resorptionbidonvilles/ui";
import TagCommentaire from "@/components/TagCommentaire/TagCommentaire.vue";

const props = defineProps({
    comment: {
        type: Object,
    },
    allowAttachmentDeletion: {
        type: Boolean,
        default: false,
    },
    showModeration: {
        type: Boolean,
        default: false,
    },
    onUpdate: {
        type: Function,
        default: null,
    },
});

const emit = defineEmits(["moderate", "deleteAttachment"]);

const isHover = ref(false);
const isEditing = ref(false);
const isLoading = ref(false);
const editedDescription = ref("");
const editError = ref("");
const { comment, showModeration, onUpdate } = toRefs(props);

const isOwner = computed(() => {
    const configStore = useConfigStore();
    return comment.value.createdBy.id === configStore.config.user.id;
});

const canModerate = computed(() => {
    const userStore = useUserStore();
    return userStore.hasPermission("data.moderate");
});

function deleteMessage() {
    emit("moderate");
}

function startEditing() {
    isEditing.value = true;
    editedDescription.value = comment.value.description;
    editError.value = "";
}

function cancelEdit() {
    isEditing.value = false;
    editedDescription.value = "";
    editError.value = "";
}

async function saveEdit() {
    if (!editedDescription.value.trim()) {
        return;
    }

    isLoading.value = true;
    editError.value = "";
    try {
        await onUpdate.value(comment.value.id, editedDescription.value);
        isEditing.value = false;
        editedDescription.value = "";
    } catch {
        editError.value =
            "La modification du message a échoué. Veuillez réessayer.";
    } finally {
        isLoading.value = false;
    }
}

const buttons = computed(() => {
    let controlButtons = [];
    if (onUpdate.value && isOwner.value && !isEditing.value) {
        controlButtons.push({
            secondary: true,
            size: "sm",
            onClick: startEditing,
            label: "Modifier",
            icon: "fr-icon-edit-line",
        });
    }
    if (
        showModeration.value &&
        (isOwner.value || (canModerate.value && isHover.value))
    ) {
        controlButtons.push({
            primary: true,
            size: "sm",
            onClick: deleteMessage,
            label: `${isOwner.value ? "Supprimer" : "Modérer"}`,
            icon: "fr-icon-delete-line",
        });
    }
    return controlButtons;
});

const isUpdated = computed(() => {
    return editedDescription.value !== comment.value.description;
});

const editingButtons = computed(() => {
    return [
        {
            primary: true,
            size: "sm",
            onClick: saveEdit,
            disabled: isLoading.value || !isUpdated.value,
            label: "Enregistrer",
            icon: "fr-icon-check-line",
        },
        {
            secondary: true,
            size: "sm",
            onClick: cancelEdit,
            disabled: isLoading.value,
            label: "Annuler",
            icon: "fr-icon-close-line",
        },
    ];
});
</script>
