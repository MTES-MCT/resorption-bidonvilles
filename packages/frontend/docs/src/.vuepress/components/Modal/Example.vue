<template>
    <div>
        <Button @click="isOpen = !isOpen">{{isOpen ? 'Close' : 'Open'}}</Button>
        <Modal :isOpen="isOpen" :closeModal="closeModal">
            <template v-slot:header>Deactivate account</template>
            <template v-slot:body>Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undone.</template>
            <template v-slot:footer>
                <Button variant="cancel">Cancel</Button>
                <Button variant="primary">Deactivate</Button>
            </template>
        </Modal>
    </div>

</template>

<script>
    export default {
        data() {
            return {
                isOpen: false
            }
        },
        methods: {
            closeModal() {
                this.isOpen = false
            }
        }
    }
</script>
