const departements = [];

for (let i = 1; i < 96; i += 1) {
    if (i === 20) {
        import("./2a.svg").then(
            ({ default: data }) => (departements["2A"] = data)
        );
        import("./2b.svg").then(
            ({ default: data }) => (departements["2B"] = data)
        );
        continue;
    }

    const code = `${i}`.padStart(2, "0");
    import(`./${code}.svg`).then(
        ({ default: data }) => (departements[code] = data)
    );
}

export default departements;
