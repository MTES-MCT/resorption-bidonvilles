import formatDateSince from "../formatDateSince";

describe(
    "formatDateSince",
    () => {
        it("should work with a date on the same date", () => {
            const result = formatDateSince(Date.now() / 1000);

            expect(result).toEqual("Aujourd'hui");
        });
    },

    it("should work with of a few days", () => {
        const d = new Date();
        d.setDate(d.getDate() - 5);
        const result = formatDateSince(d.getTime() / 1000);

        expect(result).toEqual("5 jours");
    }),

    it("should work with of a few weeks", () => {
        const d = new Date();
        d.setDate(d.getDate() - 25);
        const result = formatDateSince(d.getTime() / 1000);

        expect(result).toEqual("25 jours");
    }),

    it("should work with a date of a month ago", () => {
        const d = new Date();
        d.setDate(d.getDate() - 35);
        const result = formatDateSince(d.getTime() / 1000);

        expect(result).toEqual("1 mois");
    }),

    it("should work with a date of a few months ago", () => {
        const d = new Date();
        d.setDate(d.getDate() - 125);
        const result = formatDateSince(d.getTime() / 1000);

        expect(result).toEqual("4 mois");
    }),

    it("should work with a date of a year ago", () => {
        const d = new Date();
        d.setDate(d.getDate() - 420);
        const result = formatDateSince(d.getTime() / 1000);

        expect(result).toEqual("1 an et 2 mois");
    }),

    it("should work with a date of a few years ago", () => {
        const d = new Date();
        d.setDate(d.getDate() - 800);
        const result = formatDateSince(d.getTime() / 1000);

        expect(result).toEqual("2 ans et 2 mois");
    }),

    it("should work with yesterday even if it's less than 24h", () => {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        d.setHours(23, 59, 59);

        const result = formatDateSince(d.getTime() / 1000);

        expect(result).toEqual("Hier");
    }),

    it("should work with 2 days ago even if it's less than 48h", () => {
        const d = new Date();
        d.setDate(d.getDate() - 2);
        d.setHours(23, 59, 59);

        const result = formatDateSince(d.getTime() / 1000);

        expect(result).toEqual("2 jours");
    })
);
