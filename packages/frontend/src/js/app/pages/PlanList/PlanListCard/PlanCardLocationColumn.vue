<template>
    <div class="items-center">
        <Icon icon="map-marker-alt" class="text-lg" :style="`color: blue`" />
        <span class="text-dark font-bold"> Lieu </span>
        <div>
            <span v-if="plan.location_type.id === 'shantytowns'">
                <span
                    v-for="shantytown in plan.shantytowns"
                    :key="shantytown.id"
                    >- {{ shantytown.usename }}<br
                /></span>
            </span>
            <span v-if="plan.location_type.id === 'location'">{{
                plan.location.label
            }}</span>
            <span v-if="plan.location_type.id === 'housing'"
                >Dans le logement</span
            >
            <span v-if="plan.location_type.id === 'other'"
                >{{ plan.location_details }}
            </span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        plan: {
            type: Object
        }
    }
};
</script>
