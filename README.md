# Catalogo de Comidas

Aplicacion web hecha con Astro y Supabase para registrar, listar y editar comidas favoritas por usuario.

## Integrantes

1. Tobias German
2. Facundo Pirolo

## URL de produccion

Completar con la URL final de Vercel cuando el proyecto quede vinculado:

`https://<proyecto>.vercel.app`

## Proyecto

La aplicacion esta dentro de `trabajofront`.

```sh
cd trabajofront
npm install
npm run dev
```

## Scripts principales

| Comando | Descripcion |
| --- | --- |
| `npm run dev` | Levanta Astro en modo desarrollo. |
| `npm run lint` | Ejecuta ESLint. |
| `npm run test` | Ejecuta tests unitarios con Vitest. |
| `npm run test:e2e` | Ejecuta el flujo E2E con Playwright. |
| `npm run build` | Genera la build de produccion. |
| `npm run quality` | Corre lint, tests unitarios, E2E y build. |

Los scripts desactivan la telemetry de Astro con `ASTRO_TELEMETRY_DISABLED=1` para que el pipeline no dependa de escribir configuracion en el home del runner o de la maquina local.

## Variables de entorno

Crear `trabajofront/.env` con:

```env
PUBLIC_SUPABASE_URL=<url-de-supabase>
PUBLIC_SUPABASE_ANON_KEY=<anon-key-de-supabase>
```

El test E2E usa `PUBLIC_E2E_MODE=true` desde Playwright para simular Supabase sin tocar datos reales.

## Flujo de trabajo

- `main` contiene codigo estable y desplegable.
- Ningun cambio se mergea directo a `main`.
- Cada tarea empieza con un issue asignado.
- Cada cambio entra por Pull Request y referencia su issue con `closes #numero`.
- El PR debe tener al menos una revision real del otro integrante.
- Convencion de ramas:
  - `feature/nombre-feature` para funcionalidades.
  - `fix/nombre-bug` para correcciones.
  - `docs/nombre-documentacion` para documentacion.

## CI/CD

El workflow de GitHub Actions vive en `.github/workflows/ci-cd.yml` y se ejecuta en cada push o PR a `main`.

Orden del pipeline:

1. Instalar dependencias con `npm ci`.
2. Instalar Chromium para Playwright.
3. Ejecutar `npm run lint`.
4. Ejecutar `npm run test`.
5. Ejecutar `npm run test:e2e`.
6. Ejecutar `npm run build`.
7. Desplegar a Vercel solo en push a `main`, si todos los pasos anteriores pasaron.

Secrets necesarios en GitHub:

- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Documentacion de calidad

Ver [CALIDAD.md](./CALIDAD.md).
