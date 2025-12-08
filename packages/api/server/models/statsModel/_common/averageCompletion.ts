
// Used by averageCompletionPercentage and averageCompletionPercentageByDepartement
export default (departement?: string) => `
    (SELECT
      c.fk_departement,
      ((CASE WHEN (SELECT regexp_matches(s.address, '^(.+) [0-9]+ [^,]+,? [0-9]+,? [^, ]+(,.+)?$'))[1] IS NOT NULL THEN 1 ELSE 0 END)
      +
      (CASE WHEN ft.label <> 'Inconnu' THEN 1 ELSE 0 END)
      +
      (CASE WHEN EXISTS (SELECT 1 FROM shantytown_parcel_owners po WHERE po.fk_shantytown = s.shantytown_id AND po.active = true AND po.fk_owner_type <> 1) THEN 1 ELSE 0 END)
      +
      (CASE WHEN s.census_status IS NOT NULL THEN 1 ELSE 0 END)
      +
      (CASE WHEN s.population_total IS NOT NULL THEN 1 ELSE 0 END)
      +
      (CASE WHEN s.population_couples IS NOT NULL THEN 1 ELSE 0 END)
      +
      (CASE WHEN s.population_minors IS NOT NULL THEN 1 ELSE 0 END)
      +
      (CASE WHEN s.population_total IS NOT NULL AND s.population_total >= 10 AND (SELECT COUNT(*) FROM shantytown_origins WHERE fk_shantytown = s.shantytown_id) > 0 THEN 1 ELSE 0 END))::FLOAT / 8.0 AS pourcentage_completion
    FROM
      shantytowns s
    LEFT JOIN
      cities c ON s.fk_city = c.code
    LEFT JOIN
      field_types ft ON s.fk_field_type = ft.field_type_id
    WHERE
        s.closed_at IS NULL
        ${departement ? `AND c.fk_departement = '${departement}'` : ''}
    ) AS tmp`;
