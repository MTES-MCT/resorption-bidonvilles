<template>
    <div
        class="max-w-lg px-6 mx-auto flex flex-col items-center justify-center md:max-w-screen-lg md:flex-row md:space-x-8"
    >
        <img :src="img" class="max-w-xs w-3/4" />
        <div class="mt-10 md:mt-20 mb-10 md:mb-20">
            <h1 class="text-3xl text-primary font-bold">
                Posez votre question,
            </h1>
            <h2 class="mt-4">
                Demandez de l'aide et profitez de l'expérience des
                <span class="text-secondary"
                    >{{ numberOfUsers }} utilisateurs</span
                >
                de la plateforme.
            </h2>
            <h3 class="mt-4">Votre question en une phrase:</h3>
            <div class="flex items-center mt-2 space-x-2">
                <TextInput
                    class="mb-0 flex-1"
                    placeholder="Votre question ... "
                    v-model="question"
                />
                <Button size="sm" type="button" @clicked="redirectToNewQuestion"
                    >Demander</Button
                >
            </div>
        </div>
    </div>
</template>
<script setup>
import router from "@/helpers/router";
import { ref, computed } from "vue";
import img from "@/assets/img/illustrations/communaute.svg";
import { useDirectoryStore } from "@/stores/directory.store";

import { Button, TextInput } from "@resorptionbidonvilles/ui";

const question = ref("");
const directoryStore = useDirectoryStore();

const numberOfUsers = computed(() => {
    return directoryStore.organizations.reduce((total, organization) => {
        return total + (organization.users?.length || 0);
    }, 0);
});

function redirectToNewQuestion() {
    router.push(
        `/communaute/nouvelle-question/${question.value ? question.value : ""}`
    );
}
</script>
