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
            @clear="clear"
            class="pl-10 pr-20"
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
      class="absolute left-0 top-full mt-2 w-full z-[2000] border-1 border-G300 bg-white"
      v-if="organizationSearchLabel?.length >= 3 && !isLoading && !modelValue"
    >
      <div v-if="showCategory" class="flex flex-col">
        <div
          class="flex w-full border-b border-g200 min-h-8 gap-2 p-2 pb-0"
          v-if="categoriesInSearch && results.length > 0"
          @mouseup="isClickInsideDropdown = false"
          @mouseleave="isClickInsideDropdown = false"
        >
          <p class="fr-hint-text">Filtrer par:</p>
          <DsfrTags
            :tags="categoriesInSearch"
            v-model="filteredCategories"
            @mousedown.prevent.stop="isClickInsideDropdown = true"
            @click.prevent.stop="isClickInsideDropdown = true"
          />
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
            >
              {{ getItemLabel(item) }}
            </div>
          </div>
        </div>
        <div
          class="grid justify-center items-center pt-[1.75px] h-9 w-full px-1 border-t border-G200 bg-white"
          @mousedown.prevent.stop="isClickInsideDropdown = true"
          @mouseup="isClickInsideDropdown = false"
          @mouseleave="isClickInsideDropdown = false"
          v-if="totalPages > 1"
        >
          <DsfrPagination
            v-model:current-page="currentPage"
            :pages="pages"
            :truncLimit="2"
            :prevPageTitle="
              currentPage < 1000 ? 'Page précédente' : 'Page préc.'
            "
            :nextPageTitle="currentPage < 1000 ? 'Page suivante' : 'Page suiv.'"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { toRefs, ref, computed, triggerRef, watch } from "vue";
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
  categoriesInSearch.value = [];

  rawItems.forEach((item) => {    
    const { category } = item;

    if (!categories[category]) {
      categories[category] = {
        title: category,
        items: [],
      };
      categoriesInSearch.value.push({
        label: category,
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
  error,
  onInput: baseOnInput,
  onBlur: baseOnBlur,
  onKeydown,
  selectItem,
  clear,
  abort,
  search,
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
  const value = event?.target?.value ?? "";

  if (selectedItem.value !== null) {
    selectedItem.value = null;
    organizationSearchLabel.value = "";
    emit("update:modelValue", undefined);
    return;
  }

  currentPage.value = 0;
  baseOnInput(event);
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

defineExpose({
  clear,
  focus() {
    return input.value.focus();
  },
});
</script>
<style scoped>
:deep(.fr-tags-group > li) {
  line-height: 0.2rem !important;
}
</style>