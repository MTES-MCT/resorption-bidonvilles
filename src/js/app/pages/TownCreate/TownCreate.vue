<template>
    <PrivateLayout>
        <TownForm mode="create"></TownForm>
    </PrivateLayout>
</template>

<script>
import TownForm from "#app/components/TownForm/TownForm.vue";
import PrivateLayout from "#app/components/PrivateLayout";

export default {
    components: {
        TownForm,
        PrivateLayout
    }
};
</script>
