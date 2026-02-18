import { ref, computed, onBeforeUnmount, watch } from "vue";
import debounce from "../utils/debounce";

const defaultBuildResults = (rawResults) => {
    const categories = {};
    return rawResults.reduce((acc, item) => {
        const { category } = item;

        if (!categories[category]) {
            categories[category] = {
                title: category,
                items: [],
            };
            acc.push(categories[category]);
        }

        categories[category].items.push(item);
        return acc;
    }, []);
};

const defaultGetFlatItems = (results) => results.flatMap(({ items }) => items);

const normalizePayload = (payload) => {
    if (typeof payload === "string") {
        return payload;
    }

    if (payload?.target) {
        return payload.target.value;
    }

    if (typeof payload?.value === "string") {
        return payload.value;
    }

    return String(payload ?? "");
}

export default function useAutocomplete({
    fn,
    modelValue,
    allowFreeSearch,
    autoClear,
    showCategory,
    emit,
    fieldContext = {},
    inputAdapter = {},
    options = {},
}) {
    const {
        handleChange,
        errors = ref([]),
        validate = () => {},
        value = modelValue,
    } = fieldContext;

    const {
        blurDelay = 250,
        minSearchLength = 2,
        debounceDelay = 300,
        getInitialLabel = (val) => val?.search || "",
        getSelectedLabel = (item) => item?.selectedLabel || item?.label,
        onSelect = () => {},
        onClear = () => {},
        onFetchError = () => {},
        buildResults = defaultBuildResults,
        getFlatItems = defaultGetFlatItems,
    } = options;

    const setInputValue = inputAdapter.setValue ?? (() => {});
    const blurInput = inputAdapter.blur ?? (() => {});
    const focusInput = inputAdapter.focus ?? (() => {});
    const getInputValue = inputAdapter.getValue ?? (() => "");

    const rawResults = ref([]);
    const isLoading = ref(false);
    const lastPromise = ref(null);
    const selectedItem = ref(
        modelValue.value
            ? {
                  ...modelValue.value,
                  label: getInitialLabel(modelValue.value),
                  selectedLabel: getInitialLabel(modelValue.value),
              }
            : null
    );
    const focusedItemIndex = ref(null);
    const error = ref(false);
    let lastEvent;
    let callId = 0;
    let timeout = null;

    function setSelectedFromValue(newValue) {
        if (!newValue) {
            selectedItem.value = null;
            return;
        }

        selectedItem.value = {
            ...newValue,
            label: getInitialLabel(newValue),
            selectedLabel: getInitialLabel(newValue),
        };
    }

    watch(
        modelValue,
        (newValue) => {
            setInputValue(getInitialLabel(newValue));
            setSelectedFromValue(newValue);
        },
        { immediate: true }
    );

    if (value && value !== modelValue) {
        watch(value, (val) => {
            if (val === undefined) {
                clear();
                return;
            }

            setInputValue(getInitialLabel(val));
        });
    }

    async function onInput(payload) {
        const inputValue = normalizePayload(payload);
        rawResults.value = [];
        focusedItemIndex.value = null;

        error.value = false;
        if (inputValue.length < minSearchLength) {
            abort();
            return;
        }

        if (lastPromise.value !== null) {
            lastPromise.value.catch(() => {});
        }

        lastPromise.value = debouncedGetResults(inputValue, callId);
    }

    async function getResults(value, originalCallId) {
        try {
            isLoading.value = true;
            const results = await fn.value(value);

            if (callId === originalCallId) {
                rawResults.value = results;
            }
        } catch (e) {
            error.value = true;
            onFetchError(e);
        }

        isLoading.value = false;
        lastPromise.value = null;
    }

    const debouncedGetResults = debounce(getResults, debounceDelay);

    function search(value) {
        const inputValue = normalizePayload(value);
        if (inputValue.length < minSearchLength) {
            return;
        }

        if (lastPromise.value !== null) {
            lastPromise.value.catch(() => {});
        }

        lastPromise.value = debouncedGetResults(inputValue, callId);
    }

    function abort() {
        if (lastPromise.value !== null) {
            lastPromise.value.abort();
        }

        callId++;
        isLoading.value = false;
        error.value = false;
        lastPromise.value = null;
    }

    function onBlur(event) {
        clearTimeout(timeout);
        focusedItemIndex.value = null;

        const eventValue = normalizePayload(event) || getInputValue();

        timeout = setTimeout(() => {
            rawResults.value = [];
            abort();
            if (selectedItem.value === null) {
                if (allowFreeSearch.value === true) {
                    sendEvent({
                        search: eventValue,
                        data: undefined,
                    });
                    return;
                }

                setInputValue("");
                return;
            }

            if (selectedItem.value.label === eventValue) {
                return;
            }

            if (allowFreeSearch.value === true) {
                selectedItem.value = null;
                handleChange?.({
                    search: eventValue,
                    data: undefined,
                });
                sendEvent({
                    search: eventValue,
                    data: undefined,
                });
                return;
            }

            setInputValue(getSelectedLabel(selectedItem.value));
        }, blurDelay);
        validate?.();
    }

    function selectItem(item) {
        rawResults.value = [];
        isLoading.value = false;
        lastPromise.value = null;
        selectedItem.value = item;
        const payload = {
            search: getSelectedLabel(item),
            data: item.data,
        };

        handleChange?.(payload);
        sendEvent(payload);
        onSelect(payload);

        if (autoClear.value === true) {
            clear({ sendEvent: false });
        } else {
            setInputValue(getSelectedLabel(item));
        }
    }

    function clear(options = {}) {
        rawResults.value = [];
        selectedItem.value = null;
        abort();

        if (options.sendEvent !== false) {
            handleChange?.(undefined);
            sendEvent(undefined);
        }

        setInputValue("");
        onClear();
    }

    function sendEvent(data) {
        if (
            data !== undefined &&
            lastEvent?.search === data?.search &&
            lastEvent?.data === data?.data
        ) {
            return;
        }

        emit("update:modelValue", data);
        lastEvent = data ? { ...data } : undefined;
    }

    function onKeydown(event) {
        const keys = {
            38: () => focusPreviousItem(event),
            40: () => focusNextItem(event),
            13: () => {
                if (focusedItemIndex.value !== null) {
                    selectItem(rawResults.value[focusedItemIndex.value]);
                    blurInput();
                    event.stopPropagation();
                    event.preventDefault();
                } else if (allowFreeSearch.value === true) {
                    blurInput();
                }
            },
        };

        const handler = keys[event.keyCode];
        if (handler) {
            handler();
        }
    }

    function focusPreviousItem(event) {
        if (rawResults.value.length === 0 || focusedItemIndex.value === null) {
            return;
        }

        event.preventDefault();
        if (focusedItemIndex.value === 0) {
            focusedItemIndex.value = null;
        } else {
            focusedItemIndex.value -= 1;
        }
    }

    function focusNextItem(event) {
        if (rawResults.value.length === 0) {
            return;
        }

        event.preventDefault();
        if (focusedItemIndex.value === null) {
            focusedItemIndex.value = 0;
            return;
        }

        focusedItemIndex.value = Math.min(
            rawResults.value.length - 1,
            focusedItemIndex.value + 1
        );
    }

    const focusedItemId = computed(() => {
        if (focusedItemIndex.value === null) {
            return;
        }

        return getFlatItems(results.value)[focusedItemIndex.value]?.id;
    });

    const results = computed(() => buildResults(rawResults.value, { showCategory }));

    onBeforeUnmount(() => {
        clearTimeout(timeout);
    });

    return {
        errors,
        rawResults,
        results,
        isLoading,
        selectedItem,
        focusedItemIndex,
        focusedItemId,
        error,
        onInput,
        onBlur,
        onKeydown,
        selectItem,
        clear,
        abort,
        search,
        setInputValue,
        focusInput,
    };
}