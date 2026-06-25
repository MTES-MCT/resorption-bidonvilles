const filterBy = {
    waterAccessConditions(shantytown, checked) {
        const waterStatus = shantytown.livingConditions?.water?.status?.status;

        // Si les données n'existent pas, traiter comme 'unknown'
        if (!waterStatus) {
            return checked.includes("unknown");
        }

        return checked.includes(waterStatus);
    },

    fieldType(shantytown, checked) {
        if (!shantytown.fieldType) {
            return false;
        }

        return checked.includes(shantytown.fieldType.id);
    },

    population(shantytown, checked) {
        if (shantytown.populationTotal === null) {
            return checked.includes(null);
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
        const isOpen = shantytown.status === "open";
        const isInProgress =
            shantytown.preparatoryPhasesTowardResorption &&
            shantytown.preparatoryPhasesTowardResorption.length > 0 &&
            shantytown.status === "open";

        // Les sites "Existants" incluent les sites ouverts ET en cours de résorption
        if (isOpen || isInProgress) {
            return checked.includes("open");
        }

        // Les sites "Fermés" sont tous les autres
        return checked.includes("closed");
    },

    ownerType(shantytown, checked) {
        const owners = shantytown.owners;

        if (checked.length === 0) {
            return false;
        }

        if (!Array.isArray(owners) || owners.length === 0) {
            return checked.includes(null);
        }

        return owners.some((owner) => checked.includes(owner?.type ?? null));
    },
};

export default function (shantytowns, filters) {
    const filterIds = Object.keys(filters).filter(
        (filterId) => filterBy[filterId] !== undefined
    );

    return shantytowns.filter((shantytown) => {
        return filterIds.every((filterId) => {
            return filterBy[filterId](shantytown, filters[filterId]);
        });
    });
}
