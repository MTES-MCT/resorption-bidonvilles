<template>
    <Dropdown>
        <template v-slot:button>
            <Button variant="primaryOutline" icon="chevron-down">
                <img
                    v-if="$i18n.locale === 'fr'"
                    src="./assets/FR.svg"
                    class="inline-block h-6"
                />
                <img
                    v-if="$i18n.locale === 'en'"
                    src="./assets/UK.svg"
                    class="inline-block h-6"
                />
                <img
                    v-if="$i18n.locale === 'ro'"
                    src="./assets/RO.svg"
                    class="inline-block h-6"
                />
                <img
                    v-if="$i18n.locale === 'bg'"
                    src="./assets/BG.svg"
                    class="inline-block h-6"
                />
                {{ " " }}
                <span class="uppercase">{{ $i18n.locale }}</span>
            </Button>
        </template>
        <template v-slot:menu="{ closeMenu }">
            <Menu @click="closeMenu">
                <MenuItem @click="pickLang('fr')">
                    <img src="./assets/FR.svg" class="inline-block h-6" /> FR
                </MenuItem>
                <MenuItem @click="pickLang('en')">
                    <img src="./assets/UK.svg" class="inline-block h-6" /> EN
                </MenuItem>
                <MenuItem @click="pickLang('ro')">
                    <img src="./assets/RO.svg" class="inline-block h-6" /> RO
                </MenuItem>
                <MenuItem @click="pickLang('bg')">
                    <img src="./assets/BG.svg" class="inline-block h-6" /> BG
                </MenuItem>
            </Menu>
        </template>
    </Dropdown>
</template>

<script>
import { localize } from "vee-validate";

export default {
    methods: {
        pickLang(lang) {
            this.$i18n.locale = lang;
            localize(lang);
        }
    }
};
</script>
