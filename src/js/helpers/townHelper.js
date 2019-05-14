/**
 * Returns the shortened address of the given town
 *
 * @param {Town} town
 *
 * @returns {string}
 */
export default function shortAddress({ address: fullAddress, city }) {
    if (fullAddress && fullAddress.match(/[0-9]{5}/) !== null) {
        return fullAddress.split(/[0-9]{5}/)[0].replace(/[0-9]/g, '').replace(/,/g, ' ').replace(/\s{2,}/g, ' ');
    }

    return city.name;
}
