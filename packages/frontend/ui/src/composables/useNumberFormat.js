export default function useNumberFormat() {
    const formatNumber = (value) => {
        return new Intl.NumberFormat('fr-FR', {
            maximumFractionDigits: 0,
            useGrouping: true
        }).format(value)
    }

    return {
        formatNumber
    }
}