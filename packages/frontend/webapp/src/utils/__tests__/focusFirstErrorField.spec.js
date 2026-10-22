/**
 * Régression (issue 2781) : les inputs du tableau scolaire (variant "minimal" +
 * inlineError) ne portent pas la classe "border-error". Le focus retombait sur
 * le premier input de la section Indicateurs (nombre_personnes) au lieu du
 * champ fautif (scolaire_nombre_maternelle).
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import focusFirstErrorField, {
    findFirstFieldIdInDomOrder,
} from "@/utils/focusFirstErrorField";

function mountSection() {
    document.body.innerHTML = `
        <section id="indicateurs">
            <input id="nombre_personnes" />
            <table>
                <tr><td><input id="scolaire_nombre_maternelle" /></td></tr>
                <tr><td><input id="scolaire_nombre_elementaire" /></td></tr>
            </table>
        </section>
        <div id="erreurs" tabindex="-1"></div>
    `;
    // jsdom n'implémente pas scrollIntoView
    Element.prototype.scrollIntoView = vi.fn();
}

async function run(promise) {
    const done = promise;
    await vi.advanceTimersByTimeAsync(100);
    await done;
    await vi.advanceTimersByTimeAsync(600);
}

describe("focusFirstErrorField - section indicateurs", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        mountSection();
    });

    afterEach(() => {
        vi.useRealTimers();
        document.body.innerHTML = "";
    });

    it("focus le champ cible explicite, sans classe border-error, et non le premier input", async () => {
        await run(
            focusFirstErrorField({ indicateurs: ["x"] }, "erreurs", {
                indicateurs: "scolaire_nombre_maternelle",
            })
        );

        expect(document.activeElement.id).toBe("scolaire_nombre_maternelle");
    });

    it("sans cible explicite : secours sur le premier input border-error", async () => {
        document
            .getElementById("scolaire_nombre_elementaire")
            .classList.add("border-error");

        await run(focusFirstErrorField({ indicateurs: ["x"] }));

        expect(document.activeElement.id).toBe("scolaire_nombre_elementaire");
    });

    it("cible explicite absente du DOM : retombe sur le secours", async () => {
        document
            .getElementById("scolaire_nombre_elementaire")
            .classList.add("border-error");

        await run(
            focusFirstErrorField({ indicateurs: ["x"] }, "erreurs", {
                indicateurs: "champ_inconnu",
            })
        );

        expect(document.activeElement.id).toBe("scolaire_nombre_elementaire");
    });

    it("conserve le surlignage de la section", async () => {
        // Avant le focus (500 ms) : le focus déclenche le nettoyage du surlignage
        const done = focusFirstErrorField({ indicateurs: ["x"] }, "erreurs", {
            indicateurs: "scolaire_nombre_maternelle",
        });
        await vi.advanceTimersByTimeAsync(100);
        await done;

        expect(
            document
                .getElementById("indicateurs")
                .classList.contains("field-error-highlight")
        ).toBe(true);
    });
});

describe("findFirstFieldIdInDomOrder", () => {
    beforeEach(mountSection);
    afterEach(() => {
        document.body.innerHTML = "";
    });

    it("retourne le premier champ dans l'ordre du DOM, pas celui de la liste", () => {
        expect(
            findFirstFieldIdInDomOrder([
                "scolaire_nombre_elementaire",
                "scolaire_nombre_maternelle",
            ])
        ).toBe("scolaire_nombre_maternelle");
    });

    it("ignore les ids absents et retourne null s'il n'y en a aucun", () => {
        expect(
            findFirstFieldIdInDomOrder(["absent", "scolaire_nombre_maternelle"])
        ).toBe("scolaire_nombre_maternelle");
        expect(findFirstFieldIdInDomOrder(["absent"])).toBeNull();
        expect(findFirstFieldIdInDomOrder([])).toBeNull();
    });
});
