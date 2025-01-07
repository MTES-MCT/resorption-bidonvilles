<template>
    <div>
        <TypeDeSite
            :fieldType="shantytown.fieldType"
            class="-mt-1 pt-0.5 border-0 border-red"
        />
        <div class="ml-5 mt-0">
            <div>
                {{ shantytown.statusName }} depuis <br />
                <span class="font-bold">{{ shantytown.statusSince }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import TypeDeSite from "@/components/TypeDeSite/TypeDeSite.vue";

const props = defineProps({
    shantytown: Object,
});
const { shantytown } = toRefs(props);
</script>
