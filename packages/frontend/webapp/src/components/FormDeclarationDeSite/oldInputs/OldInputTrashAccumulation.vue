<template>
    <SubQuestionWrapper
        label="Constate-t-on une accumulation de déchets sur le site ou aux abords ?"
    >
        <CheckableGroup direction="horizontal" withoutMargin>
            <Radio
                variant="radio"
                label="Oui"
                name="old_trash_accumulation"
                :value="true"
                disabled
            />
            <Radio
                variant="radio"
                label="Non"
                name="old_trash_accumulation"
                :value="false"
                disabled
            />
        </CheckableGroup>
    </SubQuestionWrapper>
</template>

<script setup>
import {
    CheckableGroup,
    Radio,
    SubQuestionWrapper,
} from "@resorptionbidonvilles/ui";
</script>
