# 🚀 Guía de Lanzamiento - RedMecánica

## Estado Actual

- ✅ Backend con autenticación, jobs, quotes, payments
- ✅ Frontend con landing, búsqueda, wizard de servicios
- ✅ Integración Webpay (modo simulación)
- ✅ Landing para captar Prestadores
- ✅ Flujo completo de solicitud de servicio

## Próximos Pasos Inmediatos

### 1.Conseguir Primeros Prestadores (Prioridad Alta)

**Canales gratuitos:**

- [ ] Unirte a grupos de Facebook de mecánicos/chilenostalleres
- [ ] Contactar talleres locales directamente (Google Maps)
- [ ] WhatsApp a conocidos del rubro
- [ ]/publicar en laboral.cl y ChileTrabajo

**Oferta inicial:**

- Primer mes sin comisión
- 3 clientes garantizados
- Visibilidad gratuita

### 2. Configurar Producción

**Backend (Railway):**

```
1. Crear proyecto en Railway
2. Provisionar PostgreSQL en el mismo proyecto
3. Conectar repositorio y seleccionar backend
4. Configurar variables de entorno
5. Build: npm run build | Start: npm run start
```

**Frontend (Hosting estático):**

```
1. Elegir proveedor (Cloudflare Pages, Netlify, Hostinger, etc.)
2. Conectar repositorio
3. Configurar VITE_API_URL
4. Deploy automático
```

### 3. Obtener Credenciales Webpay

1. Ir a transbankdevelopers.cl
2. Crear cuenta de desarrollador
3. Solicitar cuenta comercial (o usar modo prueba)
4. Configurar WEBPAY_COMMERCE_CODE y WEBPAY_API_KEY

### 4. Lanzamiento Suave (Soft Launch)

**Fase 1 (Semana 1-2):**

- 5-10 Prestadores en Santiago
- 20-50 usuarios de prueba
- Recopilar feedback

**Fase 2 (Semana 3-4):**

- Expandir a 20+ Prestadores
- Primeros pagos reales
- Corrección de bugs

**Fase 3 (Mes 2+):**

- Marketing activo
- Expansión a más comunas
- Optimización de conversión

---

## Métricas a Seguir

| Métrica     | Meta Mes 1 | Meta Mes 3 |
| ----------- | ---------- | ---------- |
| Prestadores | 20         | 100        |
| Usuarios    | 100        | 1000       |
| Servicios   | 50         | 500        |
| GMV         | $2M        | $20M       |
| NPS         | 50+        | 70+        |

---

## Contacto

- Email: contacto@redmecanica.cl
- WhatsApp: +56 9 XXXX XXXX
