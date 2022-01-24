<template>
    <div class="flex">
        <div class="text-primaryfont-bold">
            <span><Icon icon="user-circle"/></span>
        </div>
        <div class="ml-2 flex-grow">
            <span class="text-dark font-bold"> Opérateur <br /></span>
            <!-- Quand on clique sur le lien de l'opérateur, planLinkActive permet de ne pas ouvrir la page du dispositif en même temps -->
            <div
                @mouseenter="setPlanLink(false)"
                @mouseleave="setPlanLink(true)"
            >
                <Button
                    variant="primaryText"
                    :href="`/annuaire/${operator_contact.organization.id}`"
                    class="text-display-sm hover:underline -mb-1"
                >
                    {{ operator_contact.organization.name }}
                </Button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        operator_contact: {
            type: Object
        }
    },
    methods: {
        setPlanLink(value) {
            this.$emit("setPlanLink", value);
        }
    }
};
</script>
