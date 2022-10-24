<template>
    <div class="mt-8 text-center bg-G100 py-4">
        <Spinner /><br />
        <span class="text-sm text-G600"
            >Chargement des données liées aux sites</span
        >
    </div>
</template>

<script>
import { Spinner } from "@resorptionbidonvilles/ui";

export default {
    components: {
        Spinner
    }
};
</script>
