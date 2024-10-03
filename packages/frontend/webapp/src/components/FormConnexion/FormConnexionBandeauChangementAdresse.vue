<template>
    <div class="flex justify-center">
        <div class="mt-6 bg-blue-200 p-8 border rounded-lg" style="width: 50%">
            <div class="flex item-center">
                <Icon icon="circle-info" class="text-primary mr-2" />
                <p class="mb-4 font-normal text-primary text-md">
                    L'adresse de la plateforme
                    <span class="font-bold">RESORPTION-BIDONVILLES</span> va
                    changer. Nous vous invitons à mettre à jour vos favoris et à
                    vous connecter, à compter du <b>16 Octobre 2024</b>, à cette
                    nouvelle adresse:
                </p>
            </div>
            <p class="font-normal text-primary text-md">
                <Link to="https://resorption-bidonvilles.dihal.gouv.fr"
                    >https://resorption-bidonvilles.dihal.gouv.fr</Link
                >
            </p>
        </div>
    </div>
</template>
<script setup>
import { Link, Icon } from "@resorptionbidonvilles/ui";
</script>
