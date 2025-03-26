import getAddressSimpleOf from './getAddressSimpleOf';

type Shantytown = {
    addressSimple?: string,
    address: string,
    name: string | null,
};

export default (shantytown: Shantytown): string => {
    const addressSimple = shantytown.addressSimple || getAddressSimpleOf(shantytown.address);

    // process usename
    if (shantytown.name) {
        let aka;
        if (!shantytown.addressSimple) {
            aka = `site dit « ${shantytown.name} »`;
        } else {
            aka = shantytown.name;
        }

        return `${addressSimple} ${aka}`;
    }

    return addressSimple;
};
