<template>
  <div>
    <InputWrapper>
      <InputLabel label="Nom de la structure" />
      <ValidationProvider
        v-slot="{ errors }"
        rules="required"
        name="Nom de la structure"
        vid="territorial_collectivity"
      >
        <div class="v1">
          <Collectivity
            :value="collectivityName"
            @input="val => $emit('update:collectivityName', val)"
          />
        </div>
        <InputError>{{ errors[0] }}</InputError>
      </ValidationProvider>
    </InputWrapper>
    <TextInput
      id="position"
      label="Votre fonction"
      :value="collectivityFunction"
      rules="required"
      @input="val => $emit('update:collectivityFunction', val)"
    />
  </div>
</template>

<script>
import Collectivity from '#app/components/form/input/collectivity/collectivity';
import InputLabel from '#app/components/ui/primitives/input/utils/InputLabel';
import InputWrapper from '#app/components/ui/primitives/input/utils/InputWrapper';
import InputError from '#app/components/ui/primitives/input/utils/InputError';

export default {
    components: {
        InputLabel, Collectivity, InputWrapper, InputError,
    },
    props: {
        collectivityName: {
            required: true,
        },
        collectivityFunction: {
            required: true,
        },
    },
};
</script>
