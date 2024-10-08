export default {
    computed: {
        filteredProps() {
            const propsToFilter = { ...this.$attrs, ...this.$props };
            Object.keys(propsToFilter).forEach(key => {
                if (propsToFilter[key] === undefined) {
                    delete propsToFilter[key];
                }
            });
            return propsToFilter;
        }
    }
};
