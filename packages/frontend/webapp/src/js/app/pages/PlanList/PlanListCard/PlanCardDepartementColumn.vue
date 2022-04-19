<template>
    <div class="flex">
        <div class="ml-2 flex-grow">
            <span> {{ departement.name }} ({{ departement.code }}) </span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        departement: {
            type: Object
        }
    }
};
</script>
