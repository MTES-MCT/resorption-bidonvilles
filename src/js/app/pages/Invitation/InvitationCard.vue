<template>
    <div>
        <span>
            {{ guest.firstname }} {{ guest.lastname }} {{ guest.email }}
        </span>
    </div>
</template>
<script>
export default {
    name: "InvitationCard",
    props: ["guest"],
    methods: {
        deleteGuest() {
            this.$emit("deleteGuest", this.guest);
        }
    }
};
</script>
