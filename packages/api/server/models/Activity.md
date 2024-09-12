```
{
    // common to all activities
    entity: 'shantytown' || 'comment',
    action: 'creation' || 'update' || 'closing',
    date: Integer, // timestamp in seconds
    author: {
        name: String,
        organization: Integer
    },

    // for all actions of entities : 'shantytown' and 'comment' (not high covid)
    shantytown: {
        id: Integer,
        usename: String,
        city: City,
        epci: Epci,
        departement: Departement,
        region: Region
    },

    // for all actions of entity 'comment' (not high covid only)
    comment: ShantytownRawComment,

    // for all actions of entity 'comment' (high covid only)
    highCovidComment: {
        description: String,
        departements: Array.<Departement>
    },

    // for all 'update' actions
    diff: Object
}
```