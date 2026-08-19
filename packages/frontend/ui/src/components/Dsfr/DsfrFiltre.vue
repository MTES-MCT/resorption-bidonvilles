<template>
    <div class="fr-select-group dsfr-filtre" :class="{ 'fr-filtre--active': selectedCount > 0 }">
        <button
            :id="buttonId"
            type="button"
            class="fr-select fr-filtre__button"
            :class="{ 'fr-filtre__button--open': isOpen }"
            :aria-expanded="isOpen"
            :aria-controls="collapseId"
            :disabled="disabled"
            @click="toggle"
        >
            <span class="fr-filtre__button-content">
                <span
                    v-if="selectedCount > 0"
                    class="fr-filtre__count fr-badge fr-badge--info fr-badge--sm"
                >
                    {{ selectedCount }}
                </span>
                <span class="fr-filtre__title">{{ title }}</span>
            </span>
        </button>

        <div
            v-show="isOpen"
            :id="collapseId"
            ref="collapseRef"
            class="fr-filtre__collapse"
            role="region"
            :aria-labelledby="buttonId"
        >
            <p :id="hintId" class="fr-sr-only">
                Cochez une ou plusieurs options ci-dessous pour filtrer la liste.
            </p>

            <fieldset class="fr-fieldset fr-filtre__fieldset" :aria-describedby="hintId">
                <legend class="fr-sr-only">{{ title }}</legend>

                <template v-for="(option, index) in options" :key="`${buttonId}-${index}`">
                    <div
                        v-if="option.type === 'label'"
                        class="fr-fieldset__element fr-filtre__option fr-filtre__option--label"
                        :class="{
                            'fr-filtre__option--border-bottom': option.displayBottomBorder,
                        }"
                    >
                        <span
                            class="fr-text--bold fr-filtre__option-text"
                            :class="{ 'fr-pl-2v': option.lineOffset }"
                        >
                            <slot name="option" :option="option" :label="option.label">
                                {{ option.label }}
                            </slot>
                        </span>
                    </div>

                    <div
                        v-else
                        class="fr-fieldset__element fr-filtre__option"
                        :class="{
                            'fr-filtre__option--border-bottom': option.displayBottomBorder,
                        }"
                    >
                        <DsfrCheckbox
                            v-model="checkedValues"
                            :id="`${buttonId}-${option.value}`"
                            :name="buttonId"
                            :value="option.value"
                            :disabled="disabled"
                            small
                        >
                            <template #label>
                                <span
                                    class="fr-filtre__option-text"
                                    :class="{ 'fr-pl-2v': option.lineOffset }"
                                >
                                    <slot name="option" :option="option" :label="option.label">
                                        {{ option.label }}
                                    </slot>
                                </span>
                            </template>
                        </DsfrCheckbox>
                    </div>
                </template>
            </fieldset>

            <div class="fr-filtre__actions">
                <button
                    type="button"
                    class="fr-filtre__clear"
                    @click="clear"
                >
                    Effacer
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, toRefs, watch, onBeforeUnmount } from "vue";

const props = defineProps({
    name: {
        type: String,
        default: null,
    },
    title: {
        type: String,
        default: "",
    },
    options: {
        type: Array,
        default() {
            return [];
        },
    },
    modelValue: {
        type: Array,
        default() {
            return [];
        },
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(["update:modelValue", "checkedItem"]);
const { name, title, options, modelValue, disabled } = toRefs(props);

const isOpen = ref(false);
const collapseRef = ref(null);
const uniqueId = `dsfr-filtre-${Math.random().toString(36).slice(2)}`;

const buttonId = computed(() => name.value || uniqueId);
const collapseId = computed(() => `${buttonId.value}-collapse`);
const hintId = computed(() => `${buttonId.value}-hint`);

const checkedValues = computed({
    get: () => modelValue.value || [],
    set: (value) => {
        emit("update:modelValue", value);
        emit("checkedItem", value);
    },
});

const selectedCount = computed(() => checkedValues.value.length);

const toggle = () => {
    isOpen.value = !isOpen.value;
};

const close = () => {
    isOpen.value = false;
};

const clear = () => {
    checkedValues.value = [];
};

const handleClickOutside = (event) => {
    if (!isOpen.value) {
        return;
    }

    const button = document.getElementById(buttonId.value);
    const target = event.target;

    if (
        collapseRef.value &&
        !collapseRef.value.contains(target) &&
        (!button || !button.contains(target))
    ) {
        close();
    }
};

const handleEscape = (event) => {
    if (isOpen.value && event.key === "Escape") {
        close();
    }
};

watch(isOpen, (open) => {
    if (open) {
        document.addEventListener("click", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
    } else {
        document.removeEventListener("click", handleClickOutside);
        document.removeEventListener("keydown", handleEscape);
    }
});

onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside);
    document.removeEventListener("keydown", handleEscape);
});
</script>

<style scoped>
.dsfr-filtre {
    position: relative;
    display: inline-flex;
    margin: 0 !important;
    padding: 0;
}

.fr-select-group.dsfr-filtre .fr-filtre__button,
.dsfr-filtre .fr-filtre__button {
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-flex;
    align-items: center;
    width: auto;
    min-width: 10rem;
    max-width: 100%;
    padding-right: 2.5rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    border-radius: 0.25rem 0.25rem 0 0;
    box-shadow: inset 0 -2px 0 0 var(--blue-france-sun-113-625);
}

.fr-filtre__button:focus-visible {
    outline: 2px solid var(--blue-france-sun-113-625);
    outline-offset: 2px;
}

.fr-filtre__button-content {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    overflow: hidden;
    width: 100%;
}

.fr-filtre__count {
    flex-shrink: 0;
}

.fr-filtre__title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.fr-filtre__collapse {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 30;
    min-width: 16rem;
    max-width: 24rem;
    max-height: 24rem;
    overflow-y: auto;
    padding: 1rem 1rem 0 1rem;
    background-color: var(--background-contrast-grey);
    border-radius: 0.25rem 0.25rem 0 0;
    border-left: 1px solid var(--blue-france-sun-113-625);
    border-right: 1px solid var(--blue-france-sun-113-625);
    box-shadow: inset 0 -1px 0 0 var(--blue-france-sun-113-625), 0 4px 8px 0 rgba(0, 0, 0, 0.08);
    box-sizing: border-box;
}

.fr-filtre__fieldset {
    margin: 0;
    padding: 0;
    border: 0;
}

.fr-filtre__option {
    margin: 0;
    padding: 0;
}

.fr-filtre__option--label {
    padding: 0;
    margin-bottom: 0.5rem;
}

.fr-filtre__option-text {
    display: block;
    font-size: 0.875rem;
    line-height: 1.25rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.fr-filtre__option--border-bottom {
    border-bottom: 1px solid var(--border-default-grey);
    padding-bottom: 0.5rem;
    margin-bottom: 0.5rem;
}

.fr-filtre__actions {
    margin: 0 -1rem;
    padding: 0.5rem 0;
    border-top: 1px solid var(--border-default-grey);
}

.fr-filtre__clear {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.5rem 1rem 0.5rem 2.5rem;
    background: transparent;
    border: none;
    color: var(--text-default-grey);
    font-size: 0.875rem;
    line-height: 1.25rem;
    text-align: left;
    text-decoration: none;
    cursor: pointer;
}

.fr-filtre__clear:hover {
    background-color: var(--hover-tint);
    text-decoration: underline;
}

:deep(.fr-select:focus),
:deep(.fr-select:focus-visible) {
    outline: 2px solid var(--blue-france-sun-113-625);
    outline-offset: 2px;
}
</style>
