<template>
    <div class="fixed bottom-0 bg-primary text-white w-full py-4 px-6 ">
        <div class="flex justify-between max-w-lg mx-auto">
            <NavbarItem
                icon="home"
                label="Sites"
                @click.native="routeToPath('/liste-des-sites')"
            />
            <NavbarItem
                icon="pen"
                label="Notes"
                @click.native="routeToPath('/creer-note')"
            />
            <NavbarItem
                icon="unlink"
                label="Déconnexion"
                @click.native="signout"
            />
        </div>
    </div>
</template>

<script>
import NavbarItem from "./NavbarItem";

export default {
    components: {
        NavbarItem
    },
    methods: {
        signout() {
            this.$router.push("/deconnexion");
        },
        routeToPath(path) {
            if (this.$route.path !== path) this.$router.push(path);
        }
    }
};
</script>
