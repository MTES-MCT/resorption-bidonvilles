import { describe, it, expect, beforeEach } from "vitest";
import {
    normalizeEnvLabel,
    prefixTitleWithLabel,
    buildDocumentTitle,
    applyEnvironmentMarking,
} from "../envLabel.js";

describe("normalizeEnvLabel (valeurs littérales)", () => {
    it("renvoie une chaîne vide pour les littéraux undefined et null", () => {
        expect(normalizeEnvLabel("undefined")).toBe("");
        expect(normalizeEnvLabel("null")).toBe("");
    });

    it("ignore la casse et les espaces", () => {
        expect(normalizeEnvLabel("  Undefined ")).toBe("");
        expect(normalizeEnvLabel("NULL")).toBe("");
        expect(normalizeEnvLabel("nUlL")).toBe("");
    });
});

describe("applyEnvironmentMarking", () => {
    let icon;

    beforeEach(() => {
        document.head.innerHTML = "";
        icon = document.createElement("link");
        icon.setAttribute("rel", "icon");
        icon.setAttribute("href", "/favicon.ico");
        icon.setAttribute("type", "image/x-icon");
        document.head.appendChild(icon);
        document.title = "Résorption Bidonvilles";
    });

    it("préfixe le titre et modifie le favicon", () => {
        applyEnvironmentMarking("PRÉPROD");

        expect(document.title).toBe("[PRÉPROD] Résorption Bidonvilles");
        expect(icon.getAttribute("href")).toBe("/favicon-preprod.svg");
        expect(icon.getAttribute("type")).toBe("image/svg+xml");
    });

    it("ne fait rien sans label", () => {
        applyEnvironmentMarking("");

        expect(document.title).toBe("Résorption Bidonvilles");
        expect(icon.getAttribute("href")).toBe("/favicon.ico");
        expect(icon.getAttribute("type")).toBe("image/x-icon");
    });

    it("ne préfixe pas deux fois le titre", () => {
        applyEnvironmentMarking("PRÉPROD");
        applyEnvironmentMarking("PRÉPROD");

        expect(document.title).toBe("[PRÉPROD] Résorption Bidonvilles");
    });

    it("laisse un titre vide inchangé", () => {
        document.title = "";
        applyEnvironmentMarking("PRÉPROD");

        expect(document.title).toBe("");
    });
});

describe("normalizeEnvLabel", () => {
    it("renvoie une chaîne vide si la valeur est undefined ou null", () => {
        expect(normalizeEnvLabel(undefined)).toBe("");
        expect(normalizeEnvLabel(null)).toBe("");
    });

    it("renvoie une chaîne vide si la valeur est vide ou blanche", () => {
        expect(normalizeEnvLabel("")).toBe("");
        expect(normalizeEnvLabel("   ")).toBe("");
    });

    it("renvoie une chaîne vide si le placeholder n'est pas substitué", () => {
        expect(normalizeEnvLabel("${VITE_ENV_LABEL}")).toBe("");
        expect(normalizeEnvLabel("  ${VITE_ENV_LABEL} ")).toBe("");
    });

    it("renvoie le label nettoyé quand il est défini", () => {
        expect(normalizeEnvLabel("PRÉPROD")).toBe("PRÉPROD");
        expect(normalizeEnvLabel("  PRÉPROD ")).toBe("PRÉPROD");
    });
});

describe("prefixTitleWithLabel", () => {
    it("ne modifie pas le titre sans label", () => {
        expect(prefixTitleWithLabel("Titre", "")).toBe("Titre");
    });

    it("préfixe le titre avec le label entre crochets", () => {
        expect(prefixTitleWithLabel("Titre", "PRÉPROD")).toBe(
            "[PRÉPROD] Titre"
        );
    });
});

describe("buildDocumentTitle", () => {
    it("construit le titre complet sans label", () => {
        expect(buildDocumentTitle("Page", "Site", "")).toBe("Page — Site");
        expect(buildDocumentTitle(undefined, "Site", "")).toBe("Site");
    });

    it("préfixe le titre complet avec un label", () => {
        expect(buildDocumentTitle("Page", "Site", "PRÉPROD")).toBe(
            "[PRÉPROD] Page — Site"
        );
        expect(buildDocumentTitle(undefined, "Site", "PRÉPROD")).toBe(
            "[PRÉPROD] Site"
        );
    });
});
