<template>
    <FullBottomSection
        :centered="true"
        class="flex flex-col justify-center items-center"
    >
        <template>
            <header>
                <img
                    :src="townImg"
                    alt="Résorption-bidonvilles"
                    class="w-64"
                /><br />
                <h1 class="text-xl font-bold">Oups !</h1>
            </header>
            <p class="mt-6 text-red text-lg">
                <slot>Une erreur inconnue est survenue.</slot><br />
                <Button
                    v-if="retry"
                    variant="primaryText"
                    class="hover:underline"
                    size="lg"
                    :padding="false"
                    @click="retry()"
                    >Réessayer ?</Button
                >
            </p>
        </template>
    </FullBottomSection>
</template>

<script>
import townImg from "../../../../../static/img/town.png";

export default {
    props: {
        retry: {
            type: Function,
            required: false,
            default: null
        }
    },
    data() {
        return {
            townImg
        };
    }
};
</script>
