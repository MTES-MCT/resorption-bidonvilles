export default function (data) {
    const formatted = {
        name: data.name || "",
        started_at: data.started_at ? new Date(data.started_at) : undefined,
        ended_at: data.ended_at ? new Date(data.ended_at) : undefined,
        topics: data.topics ? data.topics.map(({ uid }) => uid) : [],
        goals: data.goals || "",
        location_departement:
            data.location_departement || data.location?.departement?.code,
        location_type: data.location_type || undefined,
        location_eti: data.eti
            ? {
                  search: data.eti.address,
                  data: {
                      citycode: data.eti.citycode,
                      city: "",
                      label: data.eti.address,
                      coordinates: data.latitude
                          ? [data.eti.latitude, data.eti.longitude]
                          : [],
                  },
              }
            : undefined,
        location_eti_coordinates: data.eti
            ? [data.eti.latitude, data.eti.longitude]
            : [],
        location_shantytowns: data.location_shantytowns
            ? data.location_shantytowns.map(({ id }) => id)
            : [],
        location_autre: data.location_other || "",
        managers: {
            organizations: [],
            users: data.managers
                ? data.managers
                      .map(({ users }) =>
                          users.map((user) => ({
                              id: user.id,
                              label: `${user.first_name} ${user.last_name}`,
                          }))
                      )
                      .flat()
                : [],
        },
        operators: {
            organizations: [],
            users: data.operators
                ? data.operators
                      .map(({ users }) =>
                          users.map((user) => ({
                              id: user.id,
                              label: `${user.first_name} ${user.last_name}`,
                          }))
                      )
                      .flat()
                : [],
        },
        finances: Object.keys(data.finances || {}).reduce((acc, year) => {
            acc[year] = data.finances[year].map((row) => ({
                ...row,
                finance_type: row.type.uid,
            }));
            return acc;
        }, {}),
        indicateurs: {},
    };

    if (data.metrics) {
        const fields = [
            "nombre_personnes",
            "nombre_menages",
            "nombre_femmes",
            "nombre_mineurs",
            "sante_nombre_personnes",
            "travail_nombre_personnes",
            "travail_nombre_femmes",
            "hebergement_nombre_personnes",
            "hebergement_nombre_menages",
            "logement_nombre_personnes",
            "logement_nombre_menages",
            "scolaire_mineurs_moins_de_trois_ans",
            "scolaire_mineurs_trois_ans_et_plus",
            "scolaire_mediation_moins_de_trois_ans",
            "scolaire_mediation_trois_ans_et_plus",
            "scolaire_nombre_maternelle",
            "scolaire_nombre_elementaire",
            "scolaire_nombre_college",
            "scolaire_nombre_lycee",
            "scolaire_nombre_autre",
            "scolaire_mineur_scolarise_dans_annee",
        ];

        data.metrics.forEach((metrics) => {
            const d = new Date(metrics.date);
            formatted.indicateurs[d.getFullYear()] = {};

            fields.forEach((field) => {
                formatted.indicateurs[d.getFullYear()][field] = metrics[field];
            });
        });
    }

    return formatted;
}
