<template>
    <div>
        <div
            v-for="(guest, index) in this.guestList"
            :key="index"
            class="md:flex -mb-4"
        >
            <TextInput
                class="md:mr-4 md:w-1/2"
                disabled="disabled"
                v-bind:value="guest.firstname"
            />
            <TextInput class="md:mr-4 md:w-1/2" v-bind:value="guest.lastname" />
            <TextInput class="md:w-1/2" v-bind:value="guest.email" />
            <Button
                class="absolute inset-0 -mt-12 md:mt-0 mb-12"
                variant="secondaryText"
                @click="deleteItem(index)"
            >
                {{ $t("invitationPage.delete") }}
            </Button>
        </div>
    </div>
</template>

<script>
export default {
    name: "InvitationList",
    props: {
        guestList: {
            type: Array,
            required: false,
            default() {
                return [];
            }
        }
    },
    methods: {
        deleteItem(index) {
            this.guestList.splice(index, 1);
        }
    }
};
</script>
