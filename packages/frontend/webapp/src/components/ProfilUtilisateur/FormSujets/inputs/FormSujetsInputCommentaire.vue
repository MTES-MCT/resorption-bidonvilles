<template>
    <TextArea
        id="expertise_comment"
        :label="labels.expertise_comment"
        :rows="8"
    />
</template>

<script setup>
import { TextArea } from "@resorptionbidonvilles/ui";
import labels from "../FormSujets.labels";
</script>
