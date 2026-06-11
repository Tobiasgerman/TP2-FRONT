# Calidad y automatizacion

## Estrategia general

La estrategia elegida fue proteger el flujo mas importante de la aplicacion: que un usuario pueda iniciar sesion, crear una comida y verla en su catalogo. Para eso combinamos tres niveles de validacion. Primero, lint para detectar errores simples antes de ejecutar la app. Segundo, tests unitarios sobre funciones puras de negocio, especialmente normalizacion y sanitizado de datos ingresados por usuarios. Tercero, un test E2E que recorre la aplicacion desde el navegador y valida el flujo principal completo.

El pipeline ordena esos pasos de menor a mayor costo: lint, unit tests, E2E, build y deploy. Asi se corta rapido si hay errores basicos y solo se despliega cuando el codigo paso todas las validaciones.

## Herramientas seleccionadas

- ESLint: se usa para detectar variables sin usar, referencias inexistentes y problemas simples de JavaScript. Es liviano y se integra bien con Astro.
- Vitest: se eligio para tests unitarios porque trabaja sobre Vite, que es la base de Astro. Eso evita configuraciones pesadas y permite probar modulos ESM directamente.
- Playwright: se usa para E2E porque prueba el comportamiento real en navegador y permite levantar el servidor de desarrollo automaticamente.
- GitHub Actions: se eligio para CI/CD porque queda integrado al repositorio, corre en cada PR y deja trazabilidad visible para la defensa.
- Vercel: se mantiene como plataforma de deploy porque el proyecto ya usa el adapter `@astrojs/vercel`.

Se considero Jest para unit tests, pero Vitest requiere menos configuracion en este stack. Para E2E, Playwright se prefirio sobre pruebas manuales porque permite demostrar fallos automaticamente dentro del pipeline.

## Tests desarrollados

- Unitario: `normalizeFoodInput` completa valores por defecto para categoria y descripcion, y elimina espacios sobrantes antes de guardar o mostrar una comida.
- Unitario: `isValidFoodInput` rechaza una comida sin titulo, porque el nombre es el dato minimo para que el catalogo tenga sentido.
- Unitario: `escapeHtml` escapa caracteres peligrosos de entradas de usuario.
- Unitario: `buildFoodCard` genera una tarjeta segura para el catalogo y codifica el id en el link de edicion.
- E2E: el usuario inicia sesion, crea una comida y verifica que aparece en el listado con categoria y descripcion.

## Cobertura

Se agrego el script `npm run test:coverage` con Vitest y V8. El reporte actual sobre `src/lib/food.js` da 100% de statements, 100% de functions, 100% de lines y 80% de branches. Esto supera el objetivo opcional de 60% de cobertura sobre funciones de negocio.

## Casos de uso criticos

El flujo mas importante es login -> crear comida -> ver comida en el catalogo, porque representa el valor central de la aplicacion. Tambien se priorizo el sanitizado de datos porque el usuario escribe texto libre en titulo, categoria y descripcion. Si esos datos se renderizan sin control, pueden romper el HTML o abrir una puerta a XSS.

Quedaron como siguientes candidatos para tests: registro de usuario, edicion de comidas existentes, redireccion al login cuando no hay sesion y errores de Supabase.

## Pipeline de CI/CD

El workflow `.github/workflows/ci-cd.yml` se dispara en push y pull request a `main`.

Pasos:

1. Checkout del repositorio.
2. Setup de Node.js 22.12.0.
3. Instalacion reproducible con `npm ci`.
4. Instalacion del navegador Chromium para Playwright.
5. Lint con `npm run lint`.
6. Tests unitarios con `npm run test`.
7. Test E2E con `npm run test:e2e`.
8. Build con `npm run build`.
9. Deploy a Vercel solo cuando el evento es push a `main`.

La decision principal es que el deploy dependa de todos los pasos anteriores. Si falla lint, tests o build, GitHub Actions corta el job y no publica una version potencialmente rota.

## Variables y secrets

Para build y produccion se usan:

- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`

Para deploy a Vercel se usan:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Los E2E no usan Supabase real. Playwright levanta la app con `PUBLIC_E2E_MODE=true`, y `src/lib/supabase.js` usa un mock en `localStorage`. Esto hace que el test sea estable, rapido y no dependa de datos externos.

## Limitaciones y deuda tecnica

- El E2E actual cubre el flujo principal, pero todavia no cubre registro, logout ni edicion.
- El mock de Supabase existe solo para E2E y cubre las operaciones que usa la app hoy. Si se agregan mas consultas, habra que extenderlo.
- La cobertura de tests esta concentrada en `src/lib/food.js`, que contiene funciones de negocio puras. Las paginas Astro se validan indirectamente con Playwright.
- `npm audit` reporta 6 vulnerabilidades en dependencias transitivas. No se ejecuto `npm audit fix --force` porque puede introducir cambios incompatibles; queda como deuda revisar actualizaciones de Astro/Vercel con mas tiempo.
- La URL final de produccion debe completarse en el README cuando el proyecto quede vinculado a Vercel.

## Uso de IA

Se uso Codex para generar la primera version de configuracion de calidad, tests y documentacion. El equipo debe revisar cada test y cada decision antes de la defensa, especialmente el mock de Supabase y el workflow de GitHub Actions, para poder explicar que valida cada paso y por que existe.
