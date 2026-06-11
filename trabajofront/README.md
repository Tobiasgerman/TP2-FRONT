# Catalogo de Comidas

Aplicacion web hecha con Astro y Supabase para registrar, listar y editar comidas favoritas por usuario.

Este directorio contiene el frontend del proyecto. La documentacion del TP de Calidad y Automatizacion esta en el README de la raiz y en `../CALIDAD.md`.

## Requisitos

- Node.js 22.12.0 o superior.
- Variables de entorno de Supabase en `.env`.

```env
PUBLIC_SUPABASE_URL=<url-de-supabase>
PUBLIC_SUPABASE_ANON_KEY=<anon-key-de-supabase>
```

## Comandos

```sh
npm install
npm run dev
npm run lint
npm run test
npm run test:e2e
npm run build
```

## Calidad

- `npm run lint`: ejecuta ESLint.
- `npm run test`: ejecuta tests unitarios con Vitest.
- `npm run test:coverage`: genera reporte de cobertura.
- `npm run test:e2e`: ejecuta Playwright con `PUBLIC_E2E_MODE=true` y mock de Supabase.
- `npm run quality`: corre lint, unitarios, E2E y build.

Si Playwright no tiene descargado su Chromium local, en una maquina con Google Chrome instalado se puede validar el E2E con:

```sh
npx cross-env PW_USE_SYSTEM_CHROME=true playwright test
```
