# Mapping des champs Shantytown

Ce document décrit la correspondance entre les deux représentations d'un shantytown dans l'application.

## Vue d'ensemble

| Type | Convention | Usage | Localisation |
|------|-----------|-------|--------------|
| **`ShantytownUpdateData`** | `snake_case` | Données de mise à jour (payload entrant, DB-oriented) | `packages/api/server/models/shantytownModel/_common/types/ShantytownUpdateData.d.ts` |
| **`Shantytown`** | `camelCase` | Données sérialisées (réponse API, frontend-oriented) | `packages/api/types/resources/Shantytown.d.ts` |

## Différences structurelles

### 1. Convention de nommage

```typescript
// ShantytownUpdateData (snake_case - DB)
population_total?: number | null;
declared_at?: Date | null;
is_reinstallation?: boolean;

// Shantytown (camelCase - API)
populationTotal: number | null;
declaredAt: number | null;
isReinstallation: boolean | null;
```

### 2. Types de dates

```typescript
// ShantytownUpdateData - Objets Date JavaScript
declared_at?: Date | null;
closed_at?: Date | null;
updated_at?: Date;

// Shantytown - Timestamps Unix (millisecondes)
declaredAt: number | null;
closedAt: number | null;
updatedAt: number | null;
```

### 3. Relations et objets imbriqués

```typescript
// ShantytownUpdateData - Clés étrangères simples
fk_city?: string;                    // Code INSEE
fk_field_type?: number;              // ID du type de terrain
social_origins?: number[];           // IDs des origines

// Shantytown - Objets enrichis
city: {
    code: string,
    name: string,
    latitude: number,
    longitude: number,
}
fieldType: {
    id: number,
    label: string,
}
socialOrigins: SocialOrigin[];       // Objets complets
```

## Mapping complet des champs

### Informations de base

| `ShantytownUpdateData` (DB) | `Shantytown` (API) | Type DB | Type API | Notes |
|----------------------------|-------------------|---------|----------|-------|
| `name` | `name` | `varchar` | `string \| null` | |
| `status` | `status` | `enum` | `'open' \| 'unknown' \| 'closed_by_justice' \| 'resorbed' \| 'other'` | Statut du site |
| `closing_context` | `closingContext` | `text` | `string \| null` | Contexte de fermeture |
| `latitude` | `latitude` | `numeric` | `number` | |
| `longitude` | `longitude` | `numeric` | `number` | |
| `address` | `address` | `varchar` | `string` | |
| `address_details` | `addressDetails` | `text` | `string \| null` | |
| `fk_city` | `city.code` | `varchar(5)` | `string` | Code INSEE |
| `built_at` | `builtAt` | `date` | `number \| null` | Timestamp |
| `declared_at` | `declaredAt` | `date` | `number \| null` | Timestamp |
| `closed_at` | `closedAt` | `timestamp` | `number \| null` | Timestamp |
| `fk_field_type` | `fieldType.id` | `integer` | `number` | |
| `is_reinstallation` | `isReinstallation` | `boolean` | `boolean \| null` | |
| `reinstallation_comments` | `reinstallationComments` | `text` | `string \| null` | |

### Recensement

| `ShantytownUpdateData` (DB) | `Shantytown` (API) | Type DB | Type API |
|----------------------------|-------------------|---------|----------|
| `census_status` | `censusStatus` | `enum` | `'none' \| 'done' \| 'scheduled' \| null` |
| `census_conducted_at` | `censusConductedAt` | `date` | `number \| null` |
| `census_conducted_by` | `censusConductedBy` | `varchar` | `string \| null` |

### Population

| `ShantytownUpdateData` (DB) | `Shantytown` (API) | Type DB | Type API |
|----------------------------|-------------------|---------|----------|
| `population_total` | `populationTotal` | `integer` | `number \| null` |
| `population_total_females` | `populationTotalFemales` | `integer` | `number \| null` |
| `population_couples` | `populationCouples` | `integer` | `number \| null` |
| `population_minors` | `populationMinors` | `integer` | `number \| null` |
| `population_minors_girls` | `populationMinorsGirls` | `integer` | `number \| null` |
| `population_minors_0_3` | `populationMinors0To3` | `integer` | `number \| null` |
| `population_minors_3_6` | `populationMinors3To6` | `integer` | `number \| null` |
| `population_minors_6_12` | `populationMinors6To12` | `integer` | `number \| null` |
| `population_minors_12_16` | `populationMinors12To16` | `integer` | `number \| null` |
| `population_minors_16_18` | `populationMinors16To18` | `integer` | `number \| null` |
| `minors_in_school` | `minorsInSchool` | `integer` | `number \| null` |
| `population_updated_at` | `populationUpdatedAt` | `timestamp` | `number \| null` |

### Logements

| `ShantytownUpdateData` (DB) | `Shantytown` (API) | Type DB | Type API |
|----------------------------|-------------------|---------|----------|
| `caravans` | `caravans` | `integer` | `number \| null` |
| `huts` | `huts` | `integer` | `number \| null` |
| `tents` | `tents` | `integer` | `number \| null` |
| `cars` | `cars` | `integer` | `number \| null` |
| `mattresses` | `mattresses` | `integer` | `number \| null` |

### Conditions de vie

Tous les champs de conditions de vie sont mappés vers `livingConditions.*` dans l'API.

| `ShantytownUpdateData` (DB) | `Shantytown` (API) | Type DB | Type API | Notes |
|----------------------------|-------------------|---------|----------|-------|
| `living_conditions_version` | `livingConditions.version` | `integer` | `number` | 1 ou 2 |
| `access_to_water` | `livingConditions.accessToWater` | `boolean` | `boolean \| null` | v1 |
| `water_access_type` | `livingConditions.waterAccessType` | `enum` | `string \| null` | v2 |
| `trash_accumulation` | `livingConditions.trashAccumulation` | `boolean` | `boolean \| null` | ⚠️ Attention à l'orthographe |
| `fire_prevention` | `livingConditions.firePrevention` | `boolean` | `boolean \| null` | v2 |

> **Note importante** : Le champ `trash_accumulation` a été source d'une régression (faute de frappe `trash_accumuation`). Les tests de cohérence vérifient maintenant son existence.

### Justice (nécessite permission `shantytown_justice`)

| `ShantytownUpdateData` (DB) | `Shantytown` (API) | Type DB | Type API |
|----------------------------|-------------------|---------|----------|
| `owner_complaint` | `ownerComplaint` | `boolean` | `boolean \| null` |
| `justice_procedure` | `justiceProcedure` | `boolean` | `boolean \| null` |
| `justice_rendered` | `justiceRendered` | `boolean` | `boolean \| null` |
| `justice_rendered_at` | `justiceRenderedAt` | `date` | `number \| null` |
| `justice_rendered_by` | `justiceRenderedBy` | `varchar` | `string \| null` |
| `justice_challenged` | `justiceChallenged` | `boolean` | `boolean \| null` |
| `police_status` | `policeStatus` | `enum` | `'requested' \| 'granted' \| 'none' \| null` |
| `police_requested_at` | `policeRequestedAt` | `date` | `number \| null` |
| `police_granted_at` | `policeGrantedAt` | `date` | `number \| null` |
| `bailiff` | `bailiff` | `varchar` | `string \| null` |
| `existing_litigation` | `existingLitigation` | `boolean` | `boolean \| null` |
| `evacuation_under_time_limit` | `evacuationUnderTimeLimit` | `boolean` | `boolean \| null` |
| `administrative_order_decision_at` | `administrativeOrderDecisionAt` | `date` | `number \| null` |
| `administrative_order_decision_rendered_by` | `administrativeOrderDecisionRenderedBy` | `varchar` | `string \| null` |
| `administrative_order_evacuation_at` | `administrativeOrderEvacuationAt` | `date` | `number \| null` |
| `insalubrity_order` | `insalubrityOrder` | `boolean` | `boolean \| null` |
| `insalubrity_order_displayed` | `insalubrityOrderDisplayed` | `boolean` | `boolean \| null` |
| `insalubrity_order_type` | `insalubrityOrderType` | `varchar` | `string \| null` |
| `insalubrity_order_by` | `insalubrityOrderBy` | `varchar` | `string \| null` |
| `insalubrity_order_at` | `insalubrityOrderAt` | `date` | `number \| null` |
| `insalubrity_parcels` | `insalubrityParcels` | `text` | `string \| null` |
| `attachments` | `attachments` | - | `Attachment[] \| null` | Fichiers joints |

### Propriétaire (nécessite permission `shantytown_owner`)

| `ShantytownUpdateData` (DB) | `Shantytown` (API) | Type DB | Type API |
|----------------------------|-------------------|---------|----------|
| `owner` | `owners` | - | `ParcelOwners \| []` | Géré via table de liaison |

### Fermeture

| `ShantytownUpdateData` (DB) | `Shantytown` (API) | Type DB | Type API | Notes |
|----------------------------|-------------------|---------|----------|-------|
| `closed_with_solutions` | `closedWithSolutions` | `boolean` | `'no' \| 'yes' \| 'unknown' \| null` | Conversion bool → enum |
| `resorption_target` | `resorptionTarget` | `integer` | `number \| null` | ⚠️ Année (ex: 2025) |

> **Note importante** : `resorption_target` était incorrectement typé comme `string` dans une version précédente. C'est bien un `number` (année de l'objectif de résorption).

### Relations (tableaux)

| `ShantytownUpdateData` (DB) | `Shantytown` (API) | Type DB | Type API |
|----------------------------|-------------------|---------|----------|
| `social_origins` | `socialOrigins` | `integer[]` | `SocialOrigin[]` |
| `closing_solutions` | `closingSolutions` | - | `ShantytownClosingSolution[]` |
| `sanitary_toilet_types` | `livingConditions.sanitaryToiletTypes` | `enum[]` | `string[]` |
| `electricity_access_types` | `livingConditions.electricityAccessTypes` | `enum[]` | `string[]` |
| `reinstallation_incoming_towns` | `reinstallationIncomingTowns` | `integer[]` | `IncomingTown[]` |
| `preparatory_phases` | `preparatoryPhasesTowardResorption` | `varchar[]` | `ShantytownPreparatoryPhaseTowardResorption[]` |

### Métadonnées

| `ShantytownUpdateData` (DB) | `Shantytown` (API) | Type DB | Type API | Notes |
|----------------------------|-------------------|---------|----------|-------|
| `updated_at` | `updatedAt` | `timestamp` | `number \| null` | Timestamp |
| `updated_by` | `updatedBy.id` | `integer` | `number` | Dans l'API, c'est un objet `ShantytownUser` complet |

## Champs présents uniquement dans `Shantytown` (lecture seule)

Ces champs sont calculés/enrichis côté serveur et ne peuvent pas être mis à jour directement :

- `type`: `'shantytown'` - Discriminant de type
- `updatedWithoutAnyChange`: `boolean | null`
- `city`, `epci`, `departement`, `region` - Objets géographiques complets
- `addressSimple`: `string` - Adresse formatée
- `usename`: `string` - Nom d'usage
- `comments`: `ShantytownRawComment[]` - Commentaires
- `actors`: `Actor[]` - Intervenants
- `actions`: `ShantytownAction[]` - Actions
- `changelog`: `Changelog[]` - Historique des modifications
- `createdBy`, `updatedBy` - Objets utilisateur complets
- `heatwaveStatus`: `boolean` - Statut canicule
- `completionRate`: `number` - Taux de complétude
- `distance?`: `number | null` - Distance (dans certains contextes)

## Processus de conversion

### Entrée (frontend → backend)

```typescript
// 1. Frontend envoie en camelCase
const payload = {
    populationTotal: 50,
    declaredAt: new Date('2025-01-01'),
};

// 2. Axios transforme les Date en string "YYYY-MM-DD"
// (via dateToString dans transformRequest)

// 3. Backend reçoit et convertit en snake_case
const updateData: ShantytownUpdateData = {
    population_total: 50,
    declared_at: new Date('2025-01-01'),
};

// 4. Insertion en DB avec les noms de colonnes snake_case
```

### Sortie (backend → frontend)

```typescript
// 1. Lecture depuis la DB (colonnes snake_case)
const row = await sequelize.query('SELECT * FROM shantytowns...');

// 2. Sérialisation en camelCase
const shantytown: Shantytown = {
    populationTotal: row.population_total,
    declaredAt: row.declared_at.getTime(), // Date → timestamp
    city: {
        code: row.fk_city,
        name: cityName,
        // ... enrichissement
    },
};

// 3. Réponse API en camelCase
return shantytown;
```

## Tests de cohérence

Des tests automatisés vérifient la cohérence entre les deux types :

- **Localisation** : `packages/api/server/models/shantytownModel/_common/types/__tests__/type-consistency.spec.ts`
- **Couverture** : 
  - Mapping complet des 153 champs
  - Types critiques (`resorption_target`, `trash_accumulation`)
  - Conversion snake_case ↔ camelCase
  - Cohérence des types Date vs number

## Maintenance

### Lors de l'ajout d'un nouveau champ

1. Ajouter la colonne en DB (migration)
2. Ajouter le champ dans `ShantytownUpdateData.d.ts` (snake_case)
3. Ajouter le champ dans `Shantytown.d.ts` (camelCase)
4. Mettre à jour le mapping dans `type-consistency.spec.ts`
5. Mettre à jour cette documentation
6. Lancer les tests : `npm test -- type-consistency.spec.ts`

### Lors de la modification d'un type

1. Vérifier la cohérence DB ↔ `ShantytownUpdateData`
2. Vérifier la cohérence `ShantytownUpdateData` ↔ `Shantytown`
3. Mettre à jour les tests si nécessaire
4. Documenter les changements dans ce fichier

## Références

- **Type de mise à jour** : `packages/api/server/models/shantytownModel/_common/types/ShantytownUpdateData.d.ts`
- **Type API** : `packages/api/types/resources/Shantytown.d.ts`
- **Tests** : `packages/api/server/models/shantytownModel/_common/types/__tests__/type-consistency.spec.ts`
- **Schéma DB** : Voir les migrations dans `packages/api/db/migrations/`
