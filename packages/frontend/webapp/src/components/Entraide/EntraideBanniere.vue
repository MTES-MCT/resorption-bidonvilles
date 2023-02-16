<template>
    <div class="w-2/3 px-6 mx-auto flex items-center md:flex-row md:space-x-8">
        <img :src="img" class="h-48" />
        <div class="mt-10 mb-10">
            <h1 class="text-xl text-primary font-bold">
                Demander de l'aide à la communauté
            </h1>
            <h2 class="mt-2">
                Sollicitez l'expérience des
                <span class="text-secondary"
                    >{{ numberOfUsers }} utilisateurs</span
                >
                de notre communauté pour vous aider à résoudre un problème ou
                une question pratique que vous vous posez dans le cadre de votre
                résorption.
            </h2>
            <h3 class="mt-2">
                En une phrase, comment résumeriez-vous votre question?
            </h3>
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
