const departements = [];

for (let i = 1; i < 96; i += 1) {
    if (i === 20) {
        departements["20a"] = require("./20a.svg");
        departements["20b"] = require("./20b.svg");
        continue;
    }

    const code = `${i}`.padStart(2, "0");
    departements[code] = require(`./${code}.svg`);
}

export default departements;
