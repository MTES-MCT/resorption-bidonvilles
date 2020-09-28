<template>
    <div>
        <InputWrapper>
            <InputLabel label="Nom de la structure" />
            <div class="v1">
                <Collectivity :value="collectivityName" @input="val => $emit('update:collectivityName', val)" />
            </div>
        </InputWrapper>
        <TextInput label="Votre fonction" :value="collectivityFunction" @input="val => $emit('update:collectivityFunction', val)" />
    </div>

</template>

<script>
    import Collectivity from '#app/components/form/input/collectivity/collectivity';
    import InputLabel from '#app/components/ui/primitives/input/utils/InputLabel';
    import InputWrapper from '#app/components/ui/primitives/input/utils/InputWrapper';

    export default {
        components: { InputLabel, Collectivity, InputWrapper },
        props: {
            collectivityName: {
                required: true
            },
            collectivityFunction: {
                required: true
            },
        }
    }
</script>
