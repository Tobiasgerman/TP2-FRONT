export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function normalizeFoodInput({ title, category, description }) {
  return {
    title: String(title || "").trim(),
    category: String(category || "").trim() || "Sin categoria",
    description: String(description || "").trim() || "Sin descripcion",
  };
}

export function isValidFoodInput(food) {
  return normalizeFoodInput(food).title.length > 0;
}

export function buildFoodCard(food) {
  const normalizedFood = normalizeFoodInput(food);

  return `
          <article class="food-card">
            <span class="food-category">${escapeHtml(normalizedFood.category)}</span>
            <h3>${escapeHtml(normalizedFood.title)}</h3>
            <p>${escapeHtml(normalizedFood.description)}</p>

            <a class="edit-link" href="/update/${encodeURIComponent(food.id)}">
              Editar comida
            </a>
          </article>
        `;
}
