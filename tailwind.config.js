module.exports = {
  purge: {
    mode: "layers",
    layers: ["base", "components", "utilities"],
    content: ["./src/**/*.vue"]
  },
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true
  },
  theme: {
    fontFamily: {
      body: ["Marianne", "arial", "sans-serif"]
    },
    fontSize: {
      "size-display-xl": [
        "3rem",
        {
          lineHeight: "1.25em"
        }
      ],
      "size-display-lg": [
        "2rem",
        {
          lineHeight: "1.25em"
        }
      ],
      "size-display-md": [
        "1.5rem",
        {
          lineHeight: "1.25em"
        }
      ],
      "size-display-sm": [
        "1.25rem",
        {
          lineHeight: "1.375em"
        }
      ],
      "size-display-xs": [
        "1rem",
        {
          lineHeight: "1.375em"
        }
      ],
      "size-xl": [
        "1.5rem",
        {
          lineHeight: "1.5em"
        }
      ],
      "size-lg": [
        "1.25rem",
        {
          lineHeight: "1.5em"
        }
      ],
      "size-md": [
        "1rem",
        {
          lineHeight: "1.5em"
        }
      ],
      "size-sm": [
        "0.865rem",
        {
          lineHeight: "1.5em"
        }
      ],
      "size-xs": [
        "0.75rem",
        {
          lineHeight: "1em"
        }
      ]
    },
    extend: {
      spacing: {
        96: "24rem",
        128: "32rem"
      },
      colors: {
        // Primary palette
        blue700: "#00006D",
        primary: "#000091",
        blue600: "#000091",
        blue500: "#000074",
        blue400: "#7F7FC8",
        blue300: "#BFBFE3",
        blue200: "#E5E5F4",
        blue100: "#F2F2F9",

        // Corail / Secondary palette
        orange700: "#BF5339",
        orange600: "#FF6F4c",
        secondary: "#FF6F4c",
        orange500: "#CB634B",
        orange400: "#FFB7A5",
        orange300: "#FFDBD2",
        orange200: "#FFF0ED",
        orange100: "#FFF8F6",

        // Red palette
        red700: "#A9000B",
        red600: "#E1000F",
        red500: "#CA000D",
        red400: "#F07F87",
        red300: "#F7BFC3",
        red200: "#FCE5E7",
        red100: "#FDF2F3",

        // Functional colors
        success: "#0D6635",
        info: "#3A55D1",
        warning: "#FA5C00",
        error: "#B60000",

        // UI colors /  text
        G800: "#1E1E1E",
        G750: "#2A2A2A",
        G700: "#383838",
        G600: "#6A6A6A",
        G500: "#9C9C9C",
        G400: "#CECECE",
        G300: "#E7E7E7",
        G200: "#F0F0F0",
        G100: "#F8F8F8",
        black: "#1E1E1E",

        // Deprecated values : TO DELETE
        primaryDark: "#00006c",
        blueFrance: "#000091",
        secondaryDark: "#fe542a",
        corail: "#FF6F4C"
      }
    }
  },
  variants: {
    opacity: ["responsive"]
  }
};
