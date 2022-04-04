export default {
    computed: {
        user() {
            return this.$store.state.config.configuration.user;
        },
        showDepartementCode() {
            const userLocation = this.user.organization.location;
            if (["nation", "region"].includes(userLocation.type)) {
                return true;
            }

            if (
                userLocation.departement?.code !==
                this.activity.shantytown.departement.code
            ) {
                return true;
            }

            return false;
        }
    }
};
