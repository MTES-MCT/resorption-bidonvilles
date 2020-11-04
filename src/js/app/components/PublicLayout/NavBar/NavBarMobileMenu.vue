<template>
    <div class="origin-top-right right-0 mt-2 w-48 rounded-md shadow-lg">
        <Menu>
            <MenuItem>
                <router-link to="/connexion">
                    {{ $t("landingPage.header.connect") }}
                </router-link>
            </MenuItem>

            <MenuItem>
                <router-link to="/contact">
                    {{ $t("landingPage.header.contact") }}
                </router-link>
            </MenuItem>
            <MenuItem>
                <LanguagePicker />
            </MenuItem>
        </Menu>
    </div>
</template>

<script>
import Menu from "#app/components/ui/Menu/Menu";
import MenuItem from "#app/components/ui/Menu/MenuItem";
import LanguagePicker from "./LanguagePicker";

export default {
    props: {
        closeMenu: {
            required: true,
            type: Function
        },
        displayLanguagePicker: {
            type: Boolean
        }
    },
    components: { LanguagePicker, Menu, MenuItem },
    mounted() {
        // Delay listener, otherwise the check happens before the menu is rendered and close the menu immediately
        setTimeout(() => {
            document.addEventListener("click", this.checkOutsideClick);
        }, 0);
    },
    destroyed() {
        document.removeEventListener("click", this.checkOutsideClick);
    },
    methods: {
        checkOutsideClick(event) {
            if (!this.$el.contains(event.target)) {
                this.closeMenu();
            }
        }
    }
};
</script>
