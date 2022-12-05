<template>
    <SubQuestionWrapper label="Les toilettes se situent-elles sur le site ?">
        <CheckableGroup direction="horizontal" withoutMargin>
            <Radio
                variant="radio"
                label="Oui"
                name="old_sanitary_onSite"
                :value="true"
                disabled
            />
            <Radio
                variant="radio"
                label="Non"
                name="old_sanitary_onSite"
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
