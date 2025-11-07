const filterBy = {
    waterAccessConditions(shantytown, checked) {
        return (
            checked.indexOf(shantytown.livingConditions.water.status.status) !==
            -1
        );
    },

    fieldType(shantytown, checked) {
        return (
            shantytown.fieldType &&
            checked.indexOf(shantytown.fieldType.id) !== -1
        );
    },

    population(shantytown, checked) {
        if (shantytown.populationTotal === null) {
            return checked.indexOf(null) !== -1;
        }

        return checked.some((value) => {
            if (value === null) {
                return shantytown.populationTotal === null;
            }

            let [min, max] = value.split("-");
            min = parseInt(min, 10);
            max = parseInt(max, 10);

            if (!Number.isNaN(min) && !Number.isNaN(max)) {
                return (
                    shantytown.populationTotal >= min &&
                    shantytown.populationTotal <= max
                );
            }

            if (!Number.isNaN(min)) {
                return shantytown.populationTotal >= min;
            }

            if (!Number.isNaN(max)) {
                return shantytown.populationTotal <= max;
            }

            return false;
        });
    },

    status(shantytown, checked) {
        if (shantytown.status === "open") {
            return checked.indexOf("open") !== -1;
        }

        return checked.indexOf("closed") !== -1;
    },

    ownerType(shantytown, checked) {
        const owners = shantytown.owner?.owners;
        if (!Array.isArray(owners) || checked.length === 0) {
            return false;
        }

        return owners.some((owner) => checked.includes(owner?.type ?? null));
    },
};

export default function (shantytowns, filters) {
    const filterIds = Object.keys(filters).filter(
        (filterId) => filterBy[filterId] !== undefined
    );

    return shantytowns.filter((shantytown) => {
        const toReturn = filterIds.every((filterId) => {
            return filterBy[filterId](shantytown, filters[filterId]);
        });
        return toReturn;
    });
}
