import { describe, it, expect } from "vitest";
import readExportErrorMessage from "@/utils/readExportErrorMessage";

const MESSAGE =
    "Aucune action ne correspond aux filtres de la liste : il n'y a rien à exporter.";

function buildAxiosError(data) {
    // Forme produite par l'intercepteur de helpers/axios.js
    return {
        user_message: "Une erreur inconnue est survenue",
        error: { response: { status: 404, data } },
    };
}

describe("readExportErrorMessage()", () => {
    it("lit le user_message d'un Blob JSON", async () => {
        const blob = new Blob([JSON.stringify({ user_message: MESSAGE })], {
            type: "application/json",
        });

        expect(await readExportErrorMessage(buildAxiosError(blob))).toBe(
            MESSAGE
        );
    });

    it("lit le user_message d'un Blob JSON directement porté par l'erreur axios", async () => {
        const blob = new Blob([JSON.stringify({ user_message: MESSAGE })]);

        expect(await readExportErrorMessage({ response: { data: blob } })).toBe(
            MESSAGE
        );
    });

    it("renvoie null pour un Blob qui n'est pas du JSON", async () => {
        const blob = new Blob(["<html>Bad gateway</html>"], {
            type: "text/html",
        });

        expect(await readExportErrorMessage(buildAxiosError(blob))).toBeNull();
    });

    it("renvoie null pour un Blob JSON sans user_message", async () => {
        const blob = new Blob([JSON.stringify({ error: "autre chose" })]);

        expect(await readExportErrorMessage(buildAxiosError(blob))).toBeNull();
    });

    it("lit le user_message d'un objet déjà parsé", async () => {
        expect(
            await readExportErrorMessage(
                buildAxiosError({ user_message: MESSAGE })
            )
        ).toBe(MESSAGE);
    });

    it("ignore un user_message vide ou non textuel", async () => {
        expect(
            await readExportErrorMessage(buildAxiosError({ user_message: " " }))
        ).toBeNull();
        expect(
            await readExportErrorMessage(buildAxiosError({ user_message: 42 }))
        ).toBeNull();
    });

    it("renvoie null en l'absence de réponse", async () => {
        expect(await readExportErrorMessage(undefined)).toBeNull();
        expect(await readExportErrorMessage(null)).toBeNull();
        expect(
            await readExportErrorMessage(new Error("Network Error"))
        ).toBeNull();
        expect(
            await readExportErrorMessage(buildAxiosError(undefined))
        ).toBeNull();
    });
});
