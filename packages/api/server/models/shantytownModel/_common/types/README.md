# Types Shantytown

Ce dossier contient les définitions de types TypeScript pour les données de shantytown.

## Fichiers

### `ShantytownUpdateData.d.ts`

**Type pour les données de mise à jour** (payload entrant).

- **Convention** : `snake_case` (correspond aux colonnes DB)
- **Usage** : Paramètre de la fonction `update()`, payloads de modification
- **Optionnalité** : Tous les champs sont optionnels (mises à jour partielles)
- **Types de dates** : `Date` (objets JavaScript)

```typescript
import { ShantytownUpdateData } from './_common/types/ShantytownUpdateData.d';

async function update(
    editor: AuthUser,
    shantytownId: number,
    data: ShantytownUpdateData,  // ← Utilise ce type
    transaction?: Transaction
): Promise<number>
```

### `FIELD_MAPPING.md`

**Documentation complète du mapping** entre les deux représentations.

- Correspondance snake_case ↔ camelCase
- Types DB vs types API
- Champs calculés/enrichis
- Processus de conversion
- Guide de maintenance

📖 **Lire ce document** avant de modifier les types ou d'ajouter des champs.

### `__tests__/type-consistency.spec.ts`

**Tests de cohérence** entre `ShantytownUpdateData` et `Shantytown`.

- Vérifie que les types correspondent
- Documente le mapping via un objet `FIELD_MAPPING`
- Teste les cas critiques (régression `trash_accumulation`, type de `resorption_target`)
- S'assure que les 153 champs sont bien mappés

```bash
# Lancer les tests
yarn mocha -r ts-node/register --require ./test/bootstrap.ts server/models/shantytownModel/_common/types/__tests__/type-consistency.spec.ts --bail --exit
```

## Relation avec `Shantytown.d.ts`

Le type `Shantytown` (dans `packages/api/types/resources/Shantytown.d.ts`) représente les **données sérialisées** pour l'API :

| Aspect | `ShantytownUpdateData` | `Shantytown` |
|--------|----------------------|-------------|
| **Usage** | Mise à jour (entrée) | Lecture (sortie) |
| **Convention** | `snake_case` | `camelCase` |
| **Dates** | `Date` | `number` (timestamp) |
| **Relations** | IDs simples | Objets enrichis |
| **Optionnalité** | Tous optionnels | Champs requis |

## Workflow

### Ajouter un nouveau champ

1. **Migration DB**
   ```sql
   ALTER TABLE shantytowns ADD COLUMN new_field VARCHAR(255);
   ```

2. **Mettre à jour `ShantytownUpdateData.d.ts`**
   ```typescript
   export interface ShantytownUpdateData {
       // ...
       new_field?: string | null;
   }
   ```

3. **Mettre à jour `Shantytown.d.ts`**
   ```typescript
   type BaseShantytown = {
       // ...
       newField: string | null;
   }
   ```

4. **Ajouter au mapping dans les tests**
   ```typescript
   const FIELD_MAPPING = {
       // ...
       new_field: 'newField',
   };
   ```

5. **Documenter dans `FIELD_MAPPING.md`**

6. **Lancer les tests**
   ```bash
   npm test -- type-consistency.spec.ts
   ```

### Modifier un type existant

1. Vérifier la cohérence avec la DB
2. Mettre à jour les deux types
3. Mettre à jour les tests
4. Documenter le changement

## Bonnes pratiques

**A FAIRE**
- Toujours vérifier le type DB avant de typer un champ
- Utiliser `number | null` pour les champs numériques optionnels
- Utiliser `Date` pour les dates dans `ShantytownUpdateData`
- Documenter les champs nécessitant des permissions spéciales
- Lancer les tests après chaque modification

**A NE PAS FAIRE**
- Ne pas deviner les types sans vérifier la DB
- Ne pas utiliser `any` sauf cas exceptionnel
- Ne pas oublier de mettre à jour la documentation
- Ne pas ignorer les erreurs TypeScript

## Historique des corrections

### 2025-04-30 - Champ `status` manquant
- **Problème** : Erreur de compilation dans `close.ts` - "status does not exist in type ShantytownUpdateData"
- **Cause** : Oubli du champ `status` lors de la création manuelle du type
- **Impact** : Le service de fermeture de site ne pouvait plus compiler
- **Solution** : Ajout de `status` et `closing_context` dans `ShantytownUpdateData`
- **Prévention** : Ajout d'un test spécifique pour vérifier la présence de ces champs

### 2025-04-29 - Correction `resorption_target`
- **Problème** : Typé comme `string` au lieu de `number`
- **Cause** : Confusion avec les données de formulaire HTML
- **Solution** : Vérifié la DB (`integer`) et corrigé en `number | null`
- **Prévention** : Ajout de tests de cohérence

### 2025-04-29 - Régression `trash_accumulation`
- **Problème** : Faute de frappe `trash_accumuation` dans le SQL
- **Cause** : Copie manuelle du nom de colonne
- **Solution** : Correction de l'orthographe
- **Prévention** : Ajout d'un test spécifique pour ce champ

## Références

- **Schéma DB** : `packages/api/db/migrations/`
- **Type API** : `packages/api/types/resources/Shantytown.d.ts`
- **Sérialisation** : `packages/api/server/models/shantytownModel/_common/serializeShantytown.ts`
- **Helpers de mise à jour** : `packages/api/server/models/shantytownModel/_common/updateHelpers/`
