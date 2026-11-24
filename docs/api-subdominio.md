# Subdominio propio para la API (api.redmecanica.cl)

Objetivo: que el sitio (`redmecanica.cl`, Hostinger, estatico) y la API (Railway) queden en el mismo sitio
(`redmecanica.cl`), de modo que la cookie de sesion pueda ser `SameSite=Lax` y no dependa de cookies de terceros.

Orden importante: **primero DNS y Railway, despues el cambio en el frontend.** Si se cambia antes, el sitio queda sin API.

## 1. Railway (servicio backend)
1. Settings → Networking → **Custom Domain** → agregar `api.redmecanica.cl` (puerto del servicio: el que muestre Railway, normalmente el mismo del dominio actual).
2. Railway muestra un registro **CNAME** (algo como `xxxx.up.railway.app`) y a veces un **TXT** de verificacion. Copiarlos tal cual.

## 2. DNS (Hostinger → Dominios → DNS / Zona DNS de redmecanica.cl)
| Tipo  | Nombre | Valor                          |
|-------|--------|--------------------------------|
| CNAME | `api`  | el valor que entrego Railway   |
| TXT   | el que pida Railway (si aplica) | el valor que entrego Railway |

Esperar a que Railway marque el dominio como **verificado** y emita el certificado (minutos a un par de horas).

Comprobacion:
```powershell
curl.exe -s https://api.redmecanica.cl/api/health
```
Debe responder `{"status":"ok",...}`.

## 3. Variables en Railway (backend)
- `COOKIE_SAMESITE=lax`
- `FRONTEND_URL` debe incluir `https://redmecanica.cl` y `https://www.redmecanica.cl` (ya estan en la lista por defecto del backend).

## 4. Google Cloud (cliente OAuth)
Los origenes autorizados de JavaScript son los del **sitio** (`https://redmecanica.cl`, `https://www.redmecanica.cl`), no el de la API. No hace falta agregar `api.redmecanica.cl`.

## 5. Frontend
En `frontend/.env.production` cambiar:
```
VITE_API_URL=https://api.redmecanica.cl/api
```
Luego commit, push y redeploy en Hostinger.

## 6. Verificacion
- El modal de ingreso muestra el boton de Google.
- Iniciar sesion y esperar mas de 15 minutos: la sesion se renueva sola (la cookie de refresco viaja entre `redmecanica.cl` y `api.redmecanica.cl`).
- Registro de prestador, directorio y "Anuncios Destacados" cargan.

## Reversa
Volver `VITE_API_URL` a `https://backend-production-f294e.up.railway.app/api` y `COOKIE_SAMESITE` a su valor por defecto (en produccion es `none`).
