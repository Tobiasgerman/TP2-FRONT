import { describe, expect, it } from "vitest";
import {
  buildFoodCard,
  escapeHtml,
  isValidFoodInput,
  normalizeFoodInput,
} from "../../src/lib/food.js";

describe("food helpers", () => {
  it("normaliza campos vacios antes de guardar o mostrar comidas", () => {
    expect(
      normalizeFoodInput({
        title: "  Pizza casera  ",
        category: "",
        description: "   ",
      })
    ).toEqual({
      title: "Pizza casera",
      category: "Sin categoria",
      description: "Sin descripcion",
    });
  });

  it("rechaza comidas sin titulo", () => {
    expect(
      isValidFoodInput({
        title: "   ",
        category: "Postre",
        description: "Flan",
      })
    ).toBe(false);
  });

  it("escapa HTML de datos ingresados por usuarios", () => {
    expect(escapeHtml('<script>alert("x")</script>')).toBe(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;"
    );
  });

  it("renderiza una tarjeta segura para el catalogo", () => {
    const html = buildFoodCard({
      id: "comida 1",
      title: "<Milanesa>",
      category: "Argentina",
      description: "Con limon & papas",
    });

    expect(html).toContain("&lt;Milanesa&gt;");
    expect(html).toContain("Con limon &amp; papas");
    expect(html).toContain("/update/comida%201");
  });
});
