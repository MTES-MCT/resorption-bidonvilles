<template>
    <CheckableGroup id="mode">
        <p class="font-bold">
            <Icon class="text-red mr-1" icon="lock" /> {{ labels.mode }}
        </p>
        <Radio
            v-for="item in items"
            :key="item.uid"
            :value="item.uid"
            :label="item.label"
            name="mode"
            variant="radio"
        />
    </CheckableGroup>
</template>

<script setup>
import { CheckableGroup, Icon, Radio } from "@resorptionbidonvilles/ui";
import labels from "../FicheSiteJournalFormNouveauMessage.labels";
import items from "@/utils/comment_modes";
</script>
