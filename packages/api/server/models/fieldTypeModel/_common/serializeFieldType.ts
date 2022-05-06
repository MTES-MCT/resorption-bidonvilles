export default fieldType => ({
    id: fieldType.id,
    label: fieldType.label,
    color: `#${fieldType.color}`,
    position: fieldType.position,
});
