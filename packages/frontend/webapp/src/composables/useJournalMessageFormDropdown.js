import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import getHiddenHeight from "@/utils/getHiddenHeight";

export default function useJournalMessageFormDropdown({
    values,
    resetForm,
    messageInput,
    attachmentsInput,
    formContainer,
    interactionRoot,
    collapsedRows = 2,
    expandedRows = 5,
}) {
    const rows = ref(collapsedRows);
    const isFocusedOnMainInputs = computed(
        () => messageInput.value?.isFocused || attachmentsInput.value?.isFocused
    );
    const isFocusedInDropdown = computed(() =>
        Boolean(formContainer.value?.matches(":focus-within"))
    );
    const isFocused = computed(
        () => isFocusedOnMainInputs.value || isFocusedInDropdown.value
    );

    function openForm() {
        rows.value = expandedRows;
        formContainer.value.style.height = `${getHiddenHeight(
            formContainer.value
        )}px`;
    }

    function closeForm(reset = true) {
        rows.value = collapsedRows;
        formContainer.value.style.height = "0px";

        if (reset === true) {
            resetForm();
        }
    }

    function setAutoHeight() {
        formContainer.value.style.height = "auto";
    }

    function onDocumentPointerDown(event) {
        if (!interactionRoot?.value) {
            return;
        }

        const isInsideInteractionRoot = interactionRoot.value.contains(
            event.target
        );

        if (isInsideInteractionRoot) {
            return;
        }

        // On ferme le dropdown tout en gardant les valeurs renseignées.
        closeForm(false);
    }

    watch(isFocused, () => {
        if (isFocused.value === true) {
            openForm();
        }
    });

    watch(
        () => values.attachments?.length,
        () => {
            if (values.attachments.length > 0) {
                setAutoHeight();
            }
        }
    );

    onMounted(() => {
        document.addEventListener("pointerdown", onDocumentPointerDown, true);
    });

    onBeforeUnmount(() => {
        document.removeEventListener(
            "pointerdown",
            onDocumentPointerDown,
            true
        );
    });

    return {
        rows,
        isFocused,
        openForm,
        closeForm,
        setAutoHeight,
    };
}
