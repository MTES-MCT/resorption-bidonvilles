<template>
    <div>
        <TypeDeSite :fieldType="shantytown.fieldType" />
        <div class="ml-5 -mt-1">
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
