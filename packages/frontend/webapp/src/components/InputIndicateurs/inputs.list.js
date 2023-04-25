import sectionsList from "./sections.list";

export default sectionsList.reduce((acc, section) => {
    if (!acc[section.topic]) {
        acc[section.topic] = [];
    }

    if (Array.isArray(section.inputs)) {
        acc[section.topic].push(...section.inputs);
    } else {
        acc[section.topic].push(...Object.values(section.inputs).flat());
    }

    return acc;
}, {});
