<template>
    <form>
        <!-- Structure -->
        <p class="font-bold">
            Structure
            <Warning class="font-normal text-sm cursor-pointer" @click="contact"
                >Si vous souhaitez modifier cette information, merci de nous
                contacter</Warning
            >
        </p>
        <LinkOrganization :to="`/structure/${user.organization.id}`">{{
            user.organization.name
        }}</LinkOrganization>

        <!-- autres champs modifiables -->
        <div class="max-w-lg mt-5">
            <FormInformationsPersonnellesInputFirstName
                :default="user.first_name"
            />
            <FormInformationsPersonnellesInputLastName
                :default="user.last_name"
            />
            <FormInformationsPersonnellesInputPosition
                :default="user.position"
            />
            <FormInformationsPersonnellesInputPhone :default="user.phone" />
        </div>

        <ErrorSummary
            v-if="error || Object.keys(errors).length > 0"
            :message="error || 'Certaines données sont incorrectes'"
        />

        <Button type="submit" @click="onSubmit">Sauvegarder</Button>
    </form>
</template>

<script setup>
// utils
import ENV from "@/helpers/env";
import { ref, toRefs, computed } from "vue";
import { useForm } from "vee-validate";
import { useUserStore } from "@/stores/user.store";
import { useAccesStore } from "@/stores/acces.store";
import { useNotificationStore } from "@/stores/notification.store";
import schema from "./FormInformationsPersonnelles.schema";
import { edit as editSelf } from "@/api/me.api";
import { edit } from "@/api/users.api";

// components
import {
    LinkOrganization,
    Warning,
    Button,
    ErrorSummary,
} from "@resorptionbidonvilles/ui";
import FormInformationsPersonnellesInputFirstName from "./inputs/FormInformationsPersonnellesInputFirstName.vue";
import FormInformationsPersonnellesInputLastName from "./inputs/FormInformationsPersonnellesInputLastName.vue";
import FormInformationsPersonnellesInputPosition from "./inputs/FormInformationsPersonnellesInputPosition.vue";
import FormInformationsPersonnellesInputPhone from "./inputs/FormInformationsPersonnellesInputPhone.vue";

// data
const props = defineProps({
    user: {
        type: Object,
        required: true,
    },
});
const { user } = toRefs(props);

const error = ref(null);
const { handleSubmit, setErrors, errors } = useForm({
    validationSchema: schema,
});
const self = computed(() => {
    const userStore = useUserStore();
    return user.value.id === userStore.user?.id;
});

const onSubmit = handleSubmit(async (values) => {
    error.value = null;

    try {
        if (self.value === true) {
            const newValues = await editSelf(values);
            const userStore = useUserStore();
            Object.assign(userStore.user, newValues);
        } else {
            const accesStore = useAccesStore();
            const newValues = await edit(user.value.id, values);
            accesStore.updateUser(
                user.value.id,
                Object.assign(user.value, newValues)
            );
        }

        const notificationStore = useNotificationStore();
        notificationStore.success(
            "Informations personnelles",
            "Les informations personnelles ont bien été modifiées"
        );
    } catch (e) {
        error.value = e?.user_message || "Une erreur inconnue est survenue";
        if (e?.fields) {
            setErrors(e.fields);
        }
    }
});

function contact() {
    window.open(`mailto:${ENV.CONTACT_EMAIL}`);
}
</script>
