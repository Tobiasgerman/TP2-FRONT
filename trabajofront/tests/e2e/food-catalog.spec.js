import { expect, test } from "@playwright/test";

test("usuario inicia sesion, crea una comida y ve el catalogo", async ({ page }) => {
  await page.goto("/login");

  await page.getByLabel("Email").fill("tester@example.com");
  await page.getByLabel("Contrasena").fill("password123");
  await page.getByRole("button", { name: "Ingresar" }).click();

  await expect(page.getByRole("heading", { name: "Catalogo de Comidas" })).toBeVisible();

  await page.getByPlaceholder("Nombre de la comida").fill("Empanadas");
  await page
    .getByPlaceholder("Categoria. Ej: Postre, Pasta, Argentina")
    .fill("Argentina");
  await page.getByPlaceholder("Descripcion").fill("Carne cortada a cuchillo");
  await page.getByRole("button", { name: "Guardar comida" }).click();

  const card = page.locator(".food-card").filter({ hasText: "Empanadas" });
  await expect(card).toContainText("Argentina");
  await expect(card).toContainText("Carne cortada a cuchillo");
});
