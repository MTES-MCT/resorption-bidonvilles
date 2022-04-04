<template>
    <div>
        <div class="text-display-md">Structure</div>
        <InputGroup>
            <CheckableGroup
                :label="label"
                showMandatoryStar
                rules="required"
                id="organization_category"
            >
                <Radio
                    :value="organization_category"
                    @input="val => $emit('update:organization_category', val)"
                    checkValue="public_establishment"
                    :label="$t('contactPage.public')"
                    variant="card"
                    :disabled="disabled"
                />
                <Radio
                    :value="organization_category"
                    @input="val => $emit('update:organization_category', val)"
                    checkValue="territorial_collectivity"
                    :label="$t('contactPage.territorialCollectivity')"
                    variant="card"
                    :disabled="disabled"
                />
                <Radio
                    :value="organization_category"
                    @input="val => $emit('update:organization_category', val)"
                    checkValue="association"
                    :label="$t('contactPage.association')"
                    variant="card"
                    :disabled="disabled"
                />
                <Radio
                    :value="organization_category"
                    @input="val => $emit('update:organization_category', val)"
                    checkValue="administration"
                    :label="$t('contactPage.administration')"
                    variant="card"
                    :disabled="disabled"
                />
            </CheckableGroup>
        </InputGroup>
    </div>
</template>

<script>
export default {
    props: {
        organization_category: {
            type: String
        },
        label: {
            type: String,
            required: true
        },
        disabled: {
            type: Boolean,
            required: false,
            default: false
        }
    }
};
</script>
