<template>
    <PrivateLayout>
        <LoadingError>
            La page demandée n'existe pas
        </LoadingError>
    </PrivateLayout>
</template>

<script>
import PrivateLayout from "#app/components/PrivateLayout";
import LoadingError from "#app/components/PrivateLayout/LoadingError.vue";

export default {
    components: {
        PrivateLayout,
        LoadingError
    }
};
</script>
