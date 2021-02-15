<template>
    <div
        v-if="Object.values(errors).filter(err => err.length).length"
        class="bg-red200 p-6"
    >
        Le formulaire comprend des erreurs :

        <ul class="mt-4">
            <li
                v-for="(error, inputId) in errors"
                :key="inputId"
                v-show="error.length"
            >
                <router-link class="link" :to="{ hash: inputId }">{{
                    error[0]
                }}</router-link>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        errors: {
            type: Object,
            required: false,
            default() {
                return {};
            }
        }
    }
};
</script>
