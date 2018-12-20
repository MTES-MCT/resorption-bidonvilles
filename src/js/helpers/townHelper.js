export function all() {
    return new Promise((success) => {
        setTimeout(() => {
            const towns = [
                {
                    latitude: 43.641668,
                    longitude: 1.467486,
                    city: 'Toulouse',
                    address: 'Gramont : avenue d\'Atlanta',
                    field_type: 'Terrain',
                    field_type_id: 1,
                    population_total: 40,
                    population_couples: null,
                    population_minors: null,
                    built_at: '01/08/2013',
                    owner_type: 'public',
                    justice_status: false,
                    actions: [],
                },
            ];

            success(towns);
        }, 1000);
    });
}

export default all;
