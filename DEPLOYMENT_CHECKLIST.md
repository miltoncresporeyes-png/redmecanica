# 📦 Checklist de Deployment - Hostinger

Usa esta lista para verificar que todo esté listo antes y después del deployment.

## ✅ Pre-Deployment (Antes de subir)

### Frontend

- [ ] Archivo `frontend/.env.production` creado con valores correctos
- [ ] `VITE_API_URL` apunta al dominio correcto (ej: `https://api.tudominio.com/api`)
- [ ] Build ejecutado correctamente (`npm run build`)
- [ ] Carpeta `frontend/dist/` existe y contiene archivos
- [ ] Archivo `.htaccess` copiado a `frontend/dist/`

### Backend

- [ ] Archivo `backend/.env.production` creado (template)
- [ ] JWT secrets generados (64+ caracteres cada uno)
- [ ] Credenciales de base de datos PostgreSQL preparadas
- [ ] `ecosystem.config.js` configurado para PM2
- [ ] Dependencias actualizadas (`package-lock.json` actualizado)

### Base de Datos

- [ ] PostgreSQL instalado en servidor Hostinger
- [ ] Base de datos `redmecanica` creada
- [ ] Usuario de base de datos creado con permisos
- [ ] Conexión probada desde servidor

### Dominio y DNS

- [ ] Dominio registrado y apuntando a Hostinger
- [ ] DNS configurado correctamente
- [ ] Subdominio para API configurado (opcional: `api.tudominio.com`)

### Seguridad

- [ ] Secrets NO están en el repositorio Git
- [ ] `.env` está en `.gitignore`
- [ ] Credenciales seguras generadas
- [ ] Backup del `.env.production` guardado de forma segura

---

## 🚀 During Deployment (Durante el deployment)

### Subir Frontend

- [ ] Archivos de `dist/` subidos a `public_html/` o carpeta del dominio
- [ ] `.htaccess` presente en la raíz
- [ ] Permisos de archivos correctos (644 para archivos, 755 para carpetas)

### Subir Backend

- [ ] Código subido al servidor VPS
- [ ] `npm install --production` ejecutado
- [ ] Archivo `.env` creado manualmente en el servidor
- [ ] Variables de entorno verificadas

### Base de Datos

- [ ] Migraciones ejecutadas: `npx prisma migrate deploy`
- [ ] Seed ejecutado (opcional): `npx prisma db seed`
- [ ] Conexión verificada

### Servidor

- [ ] PM2 instalado globalmente: `npm install -g pm2`
- [ ] Backend iniciado con PM2: `pm2 start ecosystem.config.js`
- [ ] PM2 configurado para auto-inicio: `pm2 startup` y `pm2 save`
- [ ] Nginx configurado como reverse proxy (si aplica)
- [ ] SSL/HTTPS configurado con Certbot

---

## ✅ Post-Deployment (Después de subir)

### Verificación Frontend

- [ ] Sitio web carga correctamente: `https://tudominio.com`
- [ ] No hay errores 404 en las rutas
- [ ] React Router funciona (navegar a `/about`, `/ayuda`, etc.)
- [ ] Imágenes y assets cargan correctamente
- [ ] No hay errores en la consola del navegador
- [ ] Responsive design funciona en móvil

### Verificación Backend

- [ ] API responde: `curl https://tudominio.com/api` o `https://api.tudominio.com/api`
- [ ] Endpoint de salud funciona: `GET /api/health` o `/`
- [ ] CORS configurado correctamente (no hay errores de CORS)
- [ ] JWT authentication funciona
- [ ] PM2 muestra el proceso corriendo: `pm2 status`
- [ ] Logs sin errores críticos: `pm2 logs`

### Verificación Base de Datos

- [ ] Migraciones aplicadas correctamente
- [ ] Tablas creadas
- [ ] Datos de seed presentes (usuarios de prueba, servicios, etc.)
- [ ] Queries funcionan sin errores

### Verificación de Funcionalidades

- [ ] Registro de usuario funciona
- [ ] Login funciona
- [ ] Dashboard carga correctamente
- [ ] Búsqueda de servicios funciona
- [ ] Sistema de cotizaciones funciona
- [ ] Subida de imágenes funciona

### Seguridad

- [ ] HTTPS forzado (HTTP redirige a HTTPS)
- [ ] Headers de seguridad presentes
- [ ] Cookies httpOnly funcionan
- [ ] Rate limiting activo (si aplica)
- [ ] No hay endpoints expuestos innecesariamente

### Performance

- [ ] Tiempo de carga < 3 segundos
- [ ] Compresión Gzip activa
- [ ] Cache headers configurados
- [ ] Assets estáticos sirven con cache

### Monitoreo

- [ ] PM2 monitoring configurado
- [ ] Logs accesibles y archivándose correctamente
- [ ] Espacio en disco monitoreado
- [ ] Backup automatizado configurado (opcional)

---

## 🆘 Rollback Plan (Plan de emergencia)

Si algo sale mal:

1. **Frontend roto**:

   ```bash
   # Revertir a versión anterior
   # Restaurar archivos del backup
   ```

2. **Backend no responde**:

   ```bash
   pm2 restart redmecanica-backend
   pm2 logs  # Ver errores
   ```

3. **Base de datos corrupta**:

   ```bash
   # Restaurar desde backup
   sudo -u postgres psql redmecanica < backup_20260217.sql
   ```

4. **Error de migración**:
   ```bash
   # Revertir última migración
   npx prisma migrate resolve --rolled-back [migration_name]
   ```

---

## 📊 Comandos de Verificación Rápida

```bash
# Ver estado del backend
pm2 status

# Ver logs en tiempo real
pm2 logs redmecanica-backend --lines 50

# Verificar uso de recursos
htop

# Verificar espacio en disco
df -h

# Probar conexión a base de datos
sudo -u postgres psql -d redmecanica -c "SELECT COUNT(*) FROM \"User\";"

# Ver procesos escuchando en puertos
sudo netstat -tlnp | grep -E ':(80|443|3010)'

# Verificar certificado SSL
sudo certbot certificates

# Test de velocidad del sitio
curl -o /dev/null -s -w "Time: %{time_total}s\n" https://tudominio.com
```

---

## 📞 Contactos de Emergencia

- **Soporte Hostinger**: [URL del panel de soporte]
- **Dominio (NIC Chile)**: https://www.nic.cl
- **Transbank Soporte**: soporte@transbank.cl
- **Backup local**: [Ubicación de backups]

---

## 📝 Notas

Fecha de deployment: ******\_\_\_******
Versión desplegada: ******\_\_\_******
Personas que hicieron el deploy: ******\_\_\_******
Issues encontrados: ******\_\_\_******
Tiempo total de deployment: ******\_\_\_******

---

¡Deployment completado! 🎉
