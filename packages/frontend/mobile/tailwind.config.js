const commonConfig = require("@resorptionbidonvilles/ui/tailwind.config.js");

module.exports = {
    ...commonConfig,
    purge: {
        mode: "layers",
        layers: ["base", "components", "utilities"],
        content: ["./src/**/*.{vue,js}"]
    }
};
