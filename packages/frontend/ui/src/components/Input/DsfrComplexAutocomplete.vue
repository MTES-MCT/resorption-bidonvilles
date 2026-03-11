<template>
  <div class="relative">
    <DsfrInputGroup
      :descriptionId="name"
      :errorMessage="errors.length > 0 && results?.length === 0 && !organizationSearchLabel?.length ? errors : ''"
      :disabled="isDisabled"
      type="text"
      required
      :valid-message="
        (modelValue?.data?.id ||
          modelValue?.search === 'Je ne trouve pas ma structure') &&
        errors.length === 0 &&
        `${label} valide`
      "
    >
      <template #before-input>
        <span class="font-bold not-italic" aria-hidden="true">{{ label }}</span>
        <span v-if="hint" class="fr-hint-text">{{ hint }}</span>
      </template>
      <template #default>
        <div class="relative flex flex-row gap-0">
          <DsfrButton
            icon-only
            tertiary
            no-outline
            disabled
            size="md"
            icon="fr-icon-search-line"
            class="absolute left-0 top-2 !cursor-default"
          />
          <DsfrInput
            :placeholder="placeholder"
            ref="input"
            v-model="organizationSearchLabel"
            @input="onInput"
            @focus="onFocus"
            @blur="onBlur"
            :disabled="isDisabled"
            @keydown.stop="onKeydown"
            @keydown.tab="onTab"
            class="pl-10 pr-20"
            role="combobox"
            :aria-controls="`${name}-listbox`"
            :aria-expanded="organizationSearchLabel?.length >= 3 && !isLoading && !modelValue ? 'true' : 'false'"
            :aria-activedescendant="focusedItemId ? `option-${focusedItemId}` : undefined"
            aria-autocomplete="list"
          />
          <DsfrButton
            v-if="isLoading || organizationSearchLabel?.length > 2"
            :label="!isLoading ? 'Vider' : ''"
            tertiary
            no-outline
            size="sm"
            :icon="
              isLoading
                ? { name: 'fa-solid:spinner', animation: 'spin' }
                : 'fr-icon-delete-line'
            "
            class="absolute right-0 top-2 pt-2"
            @click.prevent="clear"
          />
        </div>
      </template>
    </DsfrInputGroup>
    <div
      :id="`${name}-listbox`"
      class="absolute left-0 top-full mt-2 w-full z-[2000] border-1 border-G300 bg-white"
      v-if="organizationSearchLabel?.length >= 3 && !isLoading && !modelValue"
      role="listbox"
      :aria-label="`Résultats de recherche pour ${label}`"
      @keydown="onDropdownKeydown"
      tabindex="-1"
    >
      <div v-if="showCategory" class="flex flex-col">
        <div
          class="sticky top-0 bg-white z-10 flex w-full border-b border-G200 min-h-8 gap-2 p-2 pb-0"
          v-if="categoriesInSearch && results.length > 0"
          @mouseup="isClickInsideDropdown = false"
          @mouseleave="isClickInsideDropdown = false"
          ref="filtersContainer"
          role="group"
          aria-label="Filtres par catégorie"
        >
          <p class="fr-hint-text" id="filters-label">Filtrer par:</p>
          <div
            ref="tagsContainer"
            @keydown.tab.shift.prevent="onShiftTab"
            @keydown.up.down.stop
          >
            <DsfrTags
              :tags="categoriesInSearch"
              v-model="filteredCategories"
              @mousedown.prevent.stop="isClickInsideDropdown = true"
              @click.prevent.stop="isClickInsideDropdown = true"
              aria-labelledby="filters-label"
            />
          </div>
        </div>
        <div
          v-for="section in paginatedResults"
          :key="section.title"
          class="flex"
        >
          <div
            class="w-40 px-3 py-2 text-right text-sm text-G700 border-r border-G200 border-b"
          >
            {{ section.title }}
          </div>
          <div class="border-b border-G200 flex-1">
            <div
              v-for="item in section.items"
              class="hover:bg-blue100 cursor-pointer px-3 py-2"
              :class="focusedItemId === item.id ? 'bg-blue100' : ''"
              :key="item.id"
              @click="selectItem(item)"
              :title="getItemLabel(item)"
              role="option"
              :id="`option-${item.id}`"
              :aria-selected="focusedItemId === item.id"
            >
              {{ getItemLabel(item) }}
            </div>
          </div>
        </div>
        <div
          class="flex flex-col items-center w-full px-2 py-2 border-t border-G200 bg-white"
          @mousedown.prevent.stop="isClickInsideDropdown = true"
          @mouseup="isClickInsideDropdown = false"
          @mouseleave="isClickInsideDropdown = false"
          @keydown.enter.prevent.stop="onPaginationEnter"
          @keydown.up.down.stop
          v-if="totalPages > 1"
          role="navigation"
          aria-label="Navigation dans les résultats"
        >
          <div class="text-xs text-G700 mb-2" aria-live="polite">
            Page {{ currentPage + 1 }} sur {{ totalPages }} ({{ flatResults.length }} résultats)
          </div>
          <DsfrPagination
            v-model:current-page="currentPage"
            :pages="pages"
            :truncLimit="2"
            :prevPageTitle="'Page précédente'"
            :nextPageTitle="'Page suivante'"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { toRefs, ref, computed, triggerRef, watch, nextTick } from "vue";
import { useIsSubmitting } from "vee-validate";
import useAutocomplete from "../../composables/useAutocomplete";

const props = defineProps({
  name: String,
  fn: Function,
  errors: {
    type: [Array, String],
    required: false,
    default: () => [],
  },
  hint: {
    type: String,
    required: false,
    default: "",
  },
  modelValue: {
    type: Object,
    required: false,
    default: () => undefined,
  },
  allowFreeSearch: {
    type: Boolean,
    required: false,
    default: false,
  },
  autoClear: {
    type: Boolean,
    required: false,
    default: false,
  },
  showCategory: {
    type: Boolean,
    required: false,
    default: false,
  },
  placeholder: {
    type: String,
    required: false,
    default: "",
  },
  label: {
    type: String,
    required: false,
    default: "",
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
});
const emit = defineEmits(["update:modelValue"]);
const {
  fn,
  name,
  allowFreeSearch,
  showCategory,
  modelValue,
  errors,
  placeholder,
  label,
  disabled,
  autoClear,
} = toRefs(props);

const categoriesInSearch = ref([]);
const filteredCategories = ref([]);
const currentPage = ref(0);
const isClickInsideDropdown = ref(false);
const itemsPerPage = 10;
const filtersContainer = ref(null);
const tagsContainer = ref(null);

const isSubmitting = useIsSubmitting();

const organizationSearchLabel = ref(modelValue.value?.search || "");

const buildResults = (rawItems, { showCategory }) => {
  if (!showCategory?.value) {
    return [
      {
        title: "",
        items: rawItems,
      },
    ];
  }

  const categories = {};
  categoriesInSearch.value = new Set();

  rawItems.forEach((item) => {    
    const { category, category_label } = item;

    if (!categories[category]) {
      categories[category] = {
        title: category_label,
        items: [],
      };
      categoriesInSearch.value.add({
        label: category_label,
        selectable: true,
        selected: false,
        small: true,
        value: category,
      });
    }

    if (
      filteredCategories.value.length === 0 ||
      filteredCategories.value.includes(category)
    ) {
      categories[category].items.push(item);
    }
  });

  return Object.values(categories);
};

const input = ref(null);

const totalPages = computed(() => {
  return Math.ceil(flatResults.value.length / itemsPerPage);
});

const pages = computed(() => {
  let results = [];

  for (let i = 1; i < totalPages.value + 1; i++) {
    results.push({
      title: `${i}`,
      href: `${i}`,
      label: i,
    });
  }
  
  return results;
});

const flatResults = computed(() => results.value.flatMap((r) => r.items));

// Index de début et fin de la page courante dans flatResults
const currentPageStartIndex = computed(() => currentPage.value * itemsPerPage);
const currentPageEndIndex = computed(() => {
  const end = currentPageStartIndex.value + itemsPerPage;
  return Math.min(end, flatResults.value.length);
});

const paginatedResults = computed(() => {
  const start = currentPage.value * itemsPerPage;
  const end = start + itemsPerPage;

  if (showCategory.value) {
    const categorizedItems = results.value.flatMap((section) =>
      section.items.map((item) => ({
        ...item,
        categoryTitle: section.title,
      }))
    );

    const pageItems = categorizedItems.slice(start, end);

    const grouped = {};

    for (const item of pageItems) {
      if (item !== undefined) {
        if (!grouped[item.categoryTitle]) {
          grouped[item.categoryTitle] = {
            title: item.categoryTitle,
            items: [],
          };
        }
        grouped[item.categoryTitle].items.push(item);
      }
    }
    if (name.value === "organization") {
      grouped[""] = {
        title: "",
        items: [
          {
            id: "autre",
            selectedLabel: "",
            label: "Je ne trouve pas ma structure",
            category: "",
            data: null,
          },
        ],
      };
    }

    return Object.values(grouped);
  } else {
    return flatResults.value.slice(start, end);
  }
});

const {
  rawResults,
  results,
  isLoading,
  selectedItem,
  focusedItemIndex,
  focusedItemId,
  onInput: baseOnInput,
  onBlur: baseOnBlur,
  onKeydown: baseOnKeydown,
  search,
  clear,
  selectItem,
} = useAutocomplete({
  fn,
  modelValue,
  allowFreeSearch,
  autoClear,
  showCategory,
  emit,
  inputAdapter: {
    setValue: (val = "") => {
      organizationSearchLabel.value = val ?? "";
    },
    blur: () => input.value?.blur?.(),
    focus: () => input.value?.focus?.(),
    getValue: () => organizationSearchLabel.value ?? "",
  },
  options: {
    blurDelay: 200,
    onClear: () => {
      filteredCategories.value = [];
      currentPage.value = 0;
    },
    onFetchError: () => {
      if (Array.isArray(errors.value)) {
        errors.value.push("Le chargement des données a échoué");
      }
    },
    buildResults,
  },
});

const isDisabled = computed(() => {
  return disabled.value === true || isSubmitting.value === true;
});

function onBlur(event) {
  if (isClickInsideDropdown.value) {
    isClickInsideDropdown.value = false;
    return;
  }

  baseOnBlur(event);
}

function onFocus(event) {
  const value = event.target.value;
  if (value && value.length >= 2 && rawResults.value.length === 0) {
    currentPage.value = 0;
    search(value);
  }
}

function onInput(event) {
  if (selectedItem.value !== null) {
    selectedItem.value = null;
    organizationSearchLabel.value = "";
    emit("update:modelValue", undefined);
    return;
  }

  currentPage.value = 0;
  baseOnInput(event);
}

function onKeydown(event) {
  const key = event.keyCode || event.which;
  
  // Flèches haut/bas : contraindre aux bornes de la page courante
  if (key === 38) { // Flèche haut
    event.preventDefault();
    if (focusedItemIndex.value === null || focusedItemIndex.value <= currentPageStartIndex.value) {
      // Bloquer au premier élément de la page (conforme RGAA)
      focusedItemIndex.value = currentPageStartIndex.value;
    } else {
      focusedItemIndex.value -= 1;
    }
    return;
  }
  
  if (key === 40) { // Flèche bas
    event.preventDefault();
    if (focusedItemIndex.value === null) {
      focusedItemIndex.value = currentPageStartIndex.value;
    } else if (focusedItemIndex.value >= currentPageEndIndex.value - 1) {
      // Bloquer au dernier élément de la page (conforme RGAA)
      focusedItemIndex.value = currentPageEndIndex.value - 1;
    } else {
      focusedItemIndex.value += 1;
    }
    return;
  }
  
  // Autres touches : déléguer au composable
  baseOnKeydown(event);
}

function onTab(event) {
  // Si le dropdown est ouvert, empêcher Tab de fermer et naviguer vers les filtres/pagination
  if (organizationSearchLabel.value?.length >= 3 && !isLoading.value && !modelValue.value) {
    event.preventDefault();
    isClickInsideDropdown.value = true;
    
    // Focus sur le premier élément focusable dans le dropdown
    setTimeout(() => {
      const dropdown = document.getElementById(`${name.value}-listbox`);
      if (dropdown) {
        // Chercher les tags d'abord, puis les boutons de pagination
        const focusable = dropdown.querySelector('.fr-tag, button, [tabindex="0"], a');
        if (focusable) {
          focusable.focus();
        }
      }
    }, 0);
  }
}

function onShiftTab(event) {
  // Shift+Tab depuis les filtres revient à l'input
  event.preventDefault();
  input.value?.focus();
  isClickInsideDropdown.value = false;
}

function onPaginationEnter(event) {
  // Gérer Entrée sur la pagination : cliquer sur l'élément focusé
  const activeElement = document.activeElement;
  if (activeElement && (activeElement.tagName === 'BUTTON' || activeElement.tagName === 'A')) {
    activeElement.click();
  }
}

function onDropdownKeydown(event) {
  // Gérer les touches globales du dropdown
  const key = event.keyCode || event.which;
  
  // Flèches haut/bas : naviguer dans les résultats même depuis filtres/pagination
  if (key === 38 || key === 40) {
    // Si on est sur les filtres ou la pagination, rediriger vers l'input pour navigation
    const activeElement = document.activeElement;
    const isOnFiltersOrPagination = activeElement && 
      (activeElement.closest('[role="group"]') || activeElement.closest('[role="navigation"]'));
    
    if (isOnFiltersOrPagination) {
      event.preventDefault();
      // Remettre le focus sur l'input pour activer la navigation par flèches
      input.value?.focus();
      // Déclencher la navigation avec contraintes de page
      setTimeout(() => {
        onKeydown(event);
      }, 0);
    }
  }
  
  // Échap : fermer le dropdown et revenir à l'input
  if (key === 27) {
    event.preventDefault();
    input.value?.focus();
    clear();
  }
}

function getItemLabel(item) {
  if (!item?.label) {
    return '';
  }

  if (item.category === 'territorial_collectivity' && item.departement_code) {
    return `${item.label} (${item.departement_code})`;
  }

  return item.label;
}

watch(
  () => modelValue.value,
  (value) => {
    filteredCategories.value = [];
    organizationSearchLabel.value = value?.search ?? "";
    currentPage.value = 0;
  },
  { immediate: true }
);

watch(isClickInsideDropdown, (isInside) => {
  if (!isInside) {
    triggerRef(selectedItem);
  }
});

watch(currentPage, async () => {
  // Mettre le focus sur le premier élément de la nouvelle page
  focusedItemIndex.value = currentPageStartIndex.value;
  
  // Attendre le prochain tick pour que le DOM soit mis à jour
  await nextTick();
  
  // Récupérer le premier élément de la page courante
  const firstItem = flatResults.value[currentPageStartIndex.value];
  if (firstItem) {
    const optionElement = document.getElementById(`option-${firstItem.id}`);
    if (optionElement) {
      // Faire défiler jusqu'à l'élément
      optionElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }
  
  // Ramener le focus sur l'input pour permettre la navigation au clavier
  // L'élément actif sera indiqué via aria-activedescendant
  input.value?.focus();
});

defineExpose({
  clear,
  focus() {
    return input.value.focus();
  },
  filtersContainer,
  tagsContainer,
});
</script>