# Backend de justificantes en Render

Este repo ya incluye un backend Python listo para desplegar en Render.

## 1. Crear el servicio

- En Render, crea un Blueprint desde este repositorio.
- Render detectara `render.yaml` y creara el servicio `drodriDavid-proofs-api`.
- El backend escuchara en `/api/proofs/*` y tendra `healthcheck` en `/healthz`.

## 2. Mantener los archivos

- El Blueprint crea un disco persistente montado en `/opt/data`.
- Los justificantes se guardan en `/opt/data/justificantes`.
- Esto evita perder PDFs cuando el servicio se redepliega.

## 3. Conectar GitHub Pages

- Cuando Render termine, copia la URL publica del servicio.
- Edita `proofs-config.js` y pon algo como:

```js
window.CV_PROOFS_API_BASE = 'https://tu-servicio.onrender.com/api/proofs';
```

- Haz `git add`, `git commit` y `git push`.

## 4. Resultado esperado

- `https://drodridavid.github.io/cv-completo.html` seguira sirviendo la web.
- Las subidas, borrados y aperturas de justificantes iran contra el backend publicado en Render.
