<template>
    <div class="flex">
        <div class="text-primaryfont-bold">
            <span><Icon icon="user-circle"/></span>
        </div>
        <div class="ml-2 flex-grow">
            <span class="text-dark font-bold"> Pilote <br /></span>
            <Button
                @click.native.stop
                variant="primaryText"
                :href="`/annuaire/${government_contact.organization.id}`"
                class="text-display-sm font-bold hover:underline -mb-1"
            >
                {{ government_contact.organization.name }}
            </Button>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        government_contact: {
            type: Object
        }
    }
};
</script>
