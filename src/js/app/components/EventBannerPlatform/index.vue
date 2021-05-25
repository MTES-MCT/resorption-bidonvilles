<template>
    <div class="flex items-stretch border-solid mb-8" v-if="shouldBeVisible">
        <Button
            icon="calendar-alt"
            class="justify-self-start px-4 py-4"
            variant="specialEvent"
            iconPosition="left"
            target="blank"
            href="https://hello.idealco.fr/inscription-formation-resorptionbidonvilles/"
            >S’inscrire au webinaire du 31 mai</Button
        >
        <div class="justify-self-start ml-4 mt-2 italic">
            <div class="font-bold">
                Instruction du 25 janvier 2018 sur la résorption des
                bidonvilles, où en est-on 3 ans après ?
            </div>
            <div>
                Bilan d’étape lundi 31 mai de 15h à 16h30.
                <a
                    class="link"
                    target="_blank"
                    href="https://hello.idealco.fr/inscription-formation-resorptionbidonvilles/"
                    >Informations et inscription </a
                >.
            </div>
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        shouldBeVisible() {
            return new Date() < new Date("2021-06-01");
        }
    }
};
</script>
