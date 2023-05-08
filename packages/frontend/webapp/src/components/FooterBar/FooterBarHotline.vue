<template>
    <section class="max-w-md mt-8 lg:mt-0">
        <h1 class="font-bold text-lg">Un problème, une question ?</h1>
        <p class="text-sm">Appelez nous au +33 1 40 81 95 39</p>
        <p class="text-sm">
            Écrivez-nous à
            <Link :to="`mailto:${ENV.CONTACT_EMAIL}`">{{
                ENV.CONTACT_EMAIL
            }}</Link>
        </p>
    </section>
</template>

<script setup>
import ENV from "@/helpers/env";
import { Link } from "@resorptionbidonvilles/ui";
</script>
