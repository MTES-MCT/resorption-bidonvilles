import getAddressSimpleOf from './getAddressSimpleOf';

export default (shantytown) => {
    const addressSimple = getAddressSimpleOf(shantytown);

    // process usename
    if (shantytown.name) {
        let aka;
        if (!shantytown.addressSimple) {
            aka = `site dit ${shantytown.name}`;
        } else {
            aka = shantytown.name;
        }

        return `${addressSimple} « ${aka} »`;
    }

    return addressSimple;
};
