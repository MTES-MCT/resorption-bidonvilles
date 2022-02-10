<template>
    <div class="flex">
        <div class="text-primaryfont-bold">
            <span><Icon icon="user-circle"/></span>
        </div>
        <div class="ml-2 flex-grow">
            <span class="text-dark font-bold"> Opérateur <br /></span>
            <Button
                @click.native.stop
                variant="primaryText"
                :href="`/annuaire/${operator_contact.organization.id}`"
                class="text-display-sm hover:underline -mb-1"
            >
                {{ operator_contact.organization.name }}
            </Button>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        operator_contact: {
            type: Object
        }
    }
};
</script>
