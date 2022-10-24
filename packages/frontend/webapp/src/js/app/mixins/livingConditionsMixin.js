import { computed } from "vue";

export default function(shantytown) {
  let verminKey = "vermin";
  let fireKey = "firePrevention";
  if (shantytown.livingConditions.version === 2) {
    verminKey = "pest_animals";
    fireKey = "fire_prevention";
  }

  const conditions = {
    water: "eau",
    sanitary: "toilettes",
    electricity: "électricité",
    trash: "évacuation des déchets",
    [verminKey]: "prévention des nuisibles",
    [fireKey]: "prévention incendie"
  };

  return Object.keys(conditions)
    .filter(key => {
      return shantytown.livingConditions[key].status.status === "good";
    })
    .map(key => conditions[key]);
}
