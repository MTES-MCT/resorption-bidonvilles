export default {
    props: {
        organization: {
            type: Object,
            required: true
        }
    },

    mounted() {
        setTimeout(() => {
            document.addEventListener("click", this.checkOutsideClick);
        }, 500);
    },
    destroyed() {
        document.removeEventListener("click", this.checkOutsideClick);
    },

    methods: {
        checkOutsideClick(event) {
            if (!this.$refs.wrapper.contains(event.target)) {
                this.close();
            }
        },
        close() {
            this.$emit("close");
        }
    },
    computed: {
        users() {
            // Some users are hidden from the directory (PAF)
            const hiddenUserIds = [255, 475, 558, 576];

            return this.organization.users.filter(
                user => !hiddenUserIds.includes(user.id)
            );
        }
    }
};
