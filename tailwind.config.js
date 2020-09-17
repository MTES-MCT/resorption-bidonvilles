module.exports = {
    purge: {
        mode: 'layers',
        layers: ['base', 'components', 'utilities'],
        content: ['./src/**/*.vue'],
    },
    future: {
        removeDeprecatedGapUtilities: true,
        purgeLayersByDefault: true,
    },
    theme: {
        corePlugins: {
            container: false
        },
        fontFamily: {
            display: ['Marianne', 'arial', 'sans-serif'],
            body: ['Spectral', 'georgia', 'serif'],
        },
        fontSize: {
            'size-display-xl': ['3rem', {
                lineHeight: '1.25em',
            }],
            'size-display-lg': ['2rem', {
                lineHeight: '1.25em',
            }],
            'size-display-md': ['1.5rem', {
                lineHeight: '1.25em',
            }],
            'size-display-sm': ['1.25rem', {
                lineHeight: '1.375em',
            }],
            'size-display-xs': ['1rem', {
                lineHeight: '1.375em',
            }],
            'size-xl': ['1.5rem', {
                lineHeight: '1.5em',
            }],
            'size-lg': ['1.25rem', {
                lineHeight: '1.5em',
            }],
            'size-md': ['1rem', {
                lineHeight: '1.5em',
            }],
            'size-sm': ['0.865rem', {
                lineHeight: '1.5em',
            }],
            'size-xs': ['0.75rem', {
                lineHeight: '0.75em',
            }],
        },
        extend: {
            spacing: {
                96: '24rem',
                128: '32rem',
            },
            colors: {
                primary: '#000091',
                secondary: '#FF6F4C',
                black: '#1E1E1E',
                corail: '#FF6F4C',
                blueFrance: '#000091',

                // UI colors /  text
                G800: '#1E1E1E',
                G750: '#2A2A2A',
                G700: '#383838',
                G600: '#6A6A6A',
                G500: '#9C9C9C',
                G400: '#CECECE',
                G300: '#E7E7E7',
                G200: '#F0F0F0',
                G100: '#F8F8F8',

                // Functional colors
                success: '#0D6635',
                info: '#3A55D1',
                warning: '#FA5C00',
                error: '#B60000',
            },
        },
    },
    variants: {
        opacity: ['responsive'],
    }
};
