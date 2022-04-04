<template>
    <PrivateLayout>
        <PlanForm mode="create"></PlanForm>
    </PrivateLayout>
</template>

<script>
import PrivateLayout from "#app/components/PrivateLayout";
import PlanForm from "#app/components/PlanForm/PlanForm.vue";

export default {
    components: {
        PrivateLayout,
        PlanForm
    }
};
</script>
