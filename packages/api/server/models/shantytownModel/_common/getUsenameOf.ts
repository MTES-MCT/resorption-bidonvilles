import getAddressSimpleOf from './getAddressSimpleOf';

export default (shantytown) => {
    const addressSimple = shantytown.addressSimple || getAddressSimpleOf(shantytown.address);

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
