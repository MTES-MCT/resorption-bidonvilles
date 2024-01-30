<template>
    <div class="w-2/3 px-6 mx-auto flex items-center md:flex-row md:space-x-8">
        <img :src="img" class="h-48" />
        <div class="mt-10 mb-10">
            <h1 class="text-xl text-primary font-bold">Demander de l'aide</h1>
            <p class="mt-2">
                Sollicitez l'expérience des
                <span class="text-secondary"
                    ><template v-if="directoryStore.isLoading"
                        ><Spinner /></template
                    ><template v-else>{{ numberOfUsers }}</template>
                    utilisateurs</span
                >
                pour vous aider à résoudre un problème ou une question pratique
                que vous vous posez dans le cadre de votre résorption.
            </p>
            <form
                class="flex items-end mt-2 space-x-2"
                @submit="redirectToNewQuestion"
            >
                <TextInput
                    class="flex-1"
                    placeholder="Votre question ... "
                    withoutMargin="true"
                    name="question"
                    label="En une phrase, comment résumeriez-vous votre question ?"
                />
                <Button size="sm">Demander</Button>
            </form>
        </div>
    </div>
</template>
<script setup>
import router from "@/helpers/router";
import { computed } from "vue";
import { useForm } from "vee-validate";
import img from "@/assets/img/illustrations/communaute.svg";
import { useDirectoryStore } from "@/stores/directory.store";

import { Button, Spinner, TextInput } from "@resorptionbidonvilles/ui";

const directoryStore = useDirectoryStore();
const { values } = useForm({
    initialValues: {
        question: "",
    },
});

const numberOfUsers = computed(() => {
    return directoryStore.organizations.reduce((total, organization) => {
        return total + (organization.users?.length || 0);
    }, 0);
});

function redirectToNewQuestion(event) {
    event.preventDefault();

    router.push(
        `/communaute/nouvelle-question?resume=${
            values.question ? encodeURIComponent(values.question) : ""
        }`
    );
}
</script>
