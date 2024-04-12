module.exports = {
    content: [
        "./src/**/*.{vue,js}"
    ],
    theme: {
        screens: {
            xs: "25em",     // 400px
            sm: "40em",     // 640px
            md: "48em",     // 768px
            lg: "64em",     // 1024px
            xl: "80em",     // 1280px
            "2xl": "96em"   // 1536px
        },
        extend: {
            borderWidth: {
                default: "1px",
                "0": "0",
                "1": "1px",
                "2": "2px",
                "3": "3px",
                "4": "4px",
                "6": "6px",
                "8": "8px",
                "10": "10px",
                "12": "12px",
                "14": "14px",
                "16": "16px"
            },
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
            width: {
                200: "50rem"
            },
            screens: {
                print: { raw: "print" }
            },
            spacing: {
                96: "24rem",
                128: "32rem",
                256: "64rem"
            },
            colors: {
                // Design System de l'Etat
                dsfrTab: "#E3E3FD",
                dsfrTabHover: "#C1C1FB",

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
                secondary: "#BF5339",
                orange500: "#CB634B",
                orange400: "#FFB7A5",
                orange300: "#FFDBD2",
                orange200: "#FFF0ED",
                orange100: "#FFF8F6",

                // Green / Tertiary palette
                tertiary: "#00AC8C",
                tertiaryA11Y: "#026452",
                tertiaryA11Yalt: "#1b5f53",
                tertiaryA11Ydark: "#206054",
                green800: "#165F2C",
                green700: "#1E7D3B",
                green600: "#1f8d49",
                green500: "#27A658",
                green400: "#86EFAC",
                green200: "#c2fdce",
                green100: "#E9F6EE",

                // Red palette
                redA11Y: "#A9000B",
                red700: "#A9000B",
                red600: "#E1000F",
                red500: "#CA000D",
                red400: "#F07F87",
                red300: "#F7BFC3",
                red200: "#FCE5E7",
                red100: "#FDF2F3",

                // Functional colors
                success: "#008941",
                info: "#0762C8",
                warning: "#FA5C00",
                error: "#E10600",

                // UI colors /  text
                G800: "#1E1E1E",
                G750: "#2A2A2A",
                G700: "#383838",
                G600: "#5C5C5C",
                G500: "#929292",
                G400: "#CECECE",
                G300: "#E7E7E7",
                G200: "#F0F0F0",
                G100: "#F8F8F8",
                black: "#1E1E1E",

                green: "#169B62",
                red: "#D63626",
                cardBorder: "rgba(0,0,145,0.2)",

                // Deprecated values : TO DELETE
                primaryDark: "#00006c",
                blueFrance: "#000091",
                secondaryDark: "#fe542a",
                tertiaryDark: "#008068",
                corail: "#FF6F4C"
            },
        }
    },
    variants: {
        opacity: ["responsive"]
    }
};