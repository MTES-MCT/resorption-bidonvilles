export default {
    computed: {
        filteredProps() {
            const propsToFilter = { ...this.$attrs, ...this.$props };
            Object.keys(propsToFilter).forEach(key => {
                if (propsToFilter[key] === undefined) {
                    delete propsToFilter[key];
                    return;
                }

                if (key === "size") {
                    const numericSize = Number(propsToFilter[key]);
                    if (!Number.isFinite(numericSize) || numericSize <= 0) {
                        delete propsToFilter[key];
                    } else {
                        propsToFilter[key] = numericSize;
                    }
                }
            });
            return propsToFilter;
        }
    }
};
