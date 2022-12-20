<template>
    <div
        class="max-w-lg px-6 mx-auto flex flex-col items-center justify-center md:max-w-screen-lg md:flex-row md:space-x-8"
    >
        <img :src="videImg" class="max-w-xs w-3/4" />
        <div class="mt-10 md:mt-20 mb-10 md:mb-20">
            <h1 class="text-3xl font-bold">
                Aucun résultat pour cette recherche
            </h1>
            <article class="mt-4">
                Soyez le premier - la première à
                <Link to="/communaute/nouvelle-question">
                    poser une question à la communauté
                </Link>
            </article>
        </div>
    </div>
</template>

<script setup>
import videImg from "@/assets/img/illustrations/vide.svg";
import { Link } from "@resorptionbidonvilles/ui";
</script>
