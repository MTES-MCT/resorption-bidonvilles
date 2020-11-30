<template>
    <div>
        <InputGroup v-if="title" :title="title" :info="info" :id="id">
            <slot />
        </InputGroup>
        <InputWrapper v-else :id="id">
            <slot />
        </InputWrapper>
    </div>
</template>

<script>
import InputWrapper from "./InputWrapper.vue";
import InputGroup from "../InputGroup.vue";

export default {
    components: { InputWrapper, InputGroup },
    props: {
        title: { type: String },
        info: { type: String },
        id: { type: String }
    }
};
</script>
