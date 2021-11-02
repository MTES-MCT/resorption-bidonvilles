
// Used by averageCompletionPercentage and averageCompletionPercentageByDepartement
module.exports = departement => `
    (SELECT
      c.fk_departement,
      ((CASE WHEN (SELECT regexp_matches(s.address, '^(.+) [0-9]+ [^,]+,? [0-9]+,? [^, ]+(,.+)?$'))[1] IS NOT NULL THEN 1 ELSE 0 END)
      +
      (CASE WHEN ft.label <> 'Inconnu' THEN 1 ELSE 0 END)
      +
      (CASE WHEN ot.label <> 'Inconnu' THEN 1 ELSE 0 END)
      +
      (CASE WHEN s.census_status IS NOT NULL THEN 1 ELSE 0 END)
      +
      (CASE WHEN s.population_total IS NOT NULL THEN 1 ELSE 0 END)
      +
      (CASE WHEN s.population_couples IS NOT NULL THEN 1 ELSE 0 END)
      +
      (CASE WHEN s.population_minors IS NOT NULL THEN 1 ELSE 0 END)
      +
      (CASE WHEN s.population_total IS NOT NULL AND s.population_total >= 10 AND (SELECT COUNT(*) FROM shantytown_origins WHERE fk_shantytown = s.shantytown_id) > 0 THEN 1 ELSE 0 END)
      +
      (CASE WHEN et.label <> 'Inconnu' THEN 1 ELSE 0 END)
      +
      (CASE WHEN s.access_to_water IS NOT NULL THEN 1 ELSE 0 END)
      +
      (CASE WHEN s.access_to_sanitary IS NOT NULL THEN 1 ELSE 0 END)
      +
      (CASE WHEN s.trash_evacuation IS NOT NULL THEN 1 ELSE 0 END))::FLOAT / 12.0 AS pourcentage_completion
    FROM
      shantytowns s
    LEFT JOIN
      cities c ON s.fk_city = c.code
    LEFT JOIN
      field_types ft ON s.fk_field_type = ft.field_type_id
    LEFT JOIN
      owner_types ot ON s.fk_owner_type = ot.owner_type_id
    LEFT JOIN
      electricity_types et ON s.fk_electricity_type = et.electricity_type_id
    WHERE
        s.closed_at IS NULL
        ${departement ? `AND c.fk_departement = '${departement}'` : ''}
    ) AS tmp`;
