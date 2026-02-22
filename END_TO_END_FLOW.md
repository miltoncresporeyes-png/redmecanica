# Flujo End-to-End de Servicio - RedMecánica

## Control de Calidad Integral

---

## 📊 **Visión General del Flujo**

```
USUARIO → Búsqueda → Cotización → Aprobación → Ejecución → Entrega → Evaluación → Post-Venta
   ↓          ↓          ↓            ↓            ↓           ↓           ↓            ↓
 Estado:   SEARCHING  QUOTING    CONFIRMED    IN_PROGRESS  COMPLETED  REVIEWED   CLOSED
```

---

## 🔍 **FASE 1: BÚSQUEDA Y DESCUBRIMIENTO**

### Acciones del Usuario:

1. Ingresa al home o clicks en "Buscar Prestadores"
2. Define filtros:
   - **Urgencia**: Normal / Urgente / Emergencia SOS
   - **Tipo de servicio**: Mecánico / Taller / Grúa
   - **Ubicación**: Región, Comuna
   - **Presupuesto**: Rango estimado
   - **Disponibilidad**: Ahora / Programado

### Sistema de Matching Inteligente:

```typescript
Criterios de ordenamiento:
1. Distancia (más cercano primero)
2. Rating (4.5+ prioritario)
3. Trust Score (70+)
4. Trabajos completados (experiencia)
5. Tiempo de respuesta promedio
6. Disponibilidad inmediata
```

### Output:

- Lista de Prestadores ordenados
- Badges de confianza ("Elite", "Verificado", "Rápido")
- Tiempo estimado de llegada
- Precio estimado (si aplica)

**Estado del Job**: `SEARCHING`

---

## 💬 **FASE 2: SOLICITUD DE COTIZACIÓN**

### 2.1 Usuario selecciona proveedor y solicita

**Información requerida**:

- Descripción del problema (con autocompletado)
- Ubicación exacta (GPS automático + dirección)
- Fotos del problema (opcional pero recomendado)
- Urgencia (Normal / Urgente / Emergencia)
- Disponibilidad del cliente

### 2.2 Notificación al Proveedor

**Push Notification + Email + SMS**:

```
🔧 Nueva solicitud de servicio
Cliente: María G.
Problema: Batería descargada
Ubicación: 2.3 km de ti
Responder antes de: 15 minutos
[VER DETALLES] [COTIZAR]
```

### 2.3 Proveedor envía cotización

**Formulario de cotización**:

```typescript
{
  diagnosticoPreliminar: string,
  itemsServicio: [
    { descripcion: string, costo: number }
  ],
  manoDeObra: number,
  repuestos: [
    { nombre: string, costo: number, garantia: string }
  ],
  costoTotal: number,
  tiempoEstimado: number (minutos),
  garantia: string,
  formaPago: ['EFECTIVO', 'TRANSFERENCIA', 'TARJETA'],
  validezCotizacion: '24 horas'
}
```

**Estado del Job**: `QUOTING` (Cotizando)

**SLA**: Máximo 30 minutos para responder (Normal), 5 min (Emergencia)

---

## ✅ **FASE 3: APROBACIÓN Y CONTRATACIÓN**

### 3.1 Usuario revisa cotización(es)

**Comparación múltiple**:

- Lado a lado de hasta 3 cotizaciones
- Desglose detallado de costos
- Tiempo estimado
- Garantías ofrecidas
- Rating del proveedor

### 3.2 Usuario aprueba una cotización

**Confirmación**:

```
¿Confirmar servicio?
Proveedor: Taller Express
Costo total: $45,000
Llegada estimada: 25 minutos
Forma de pago: Transferencia

[CONFIRMAR Y PAGAR] [CANCELAR]
```

### 3.3 Sistema de Pago (Escrow)

**Flujo de pago seguro**:

1. Usuario paga el monto total
2. **Dinero queda RETENIDO** en cuenta escrow
3. Proveedor ve "Pago confirmado - Retenido"
4. Solo se libera cuando usuario confirma satisfacción

**Métodos de pago**:

- Transferencia bancaria
- Tarjeta de crédito/débito (Webpay Plus)
- MercadoPago / Flow
- Efectivo (pago en persona, al finalizar)

**Estado del Job**: `CONFIRMED` (Confirmado - Pago retenido)

---

## 🚗 **FASE 4: EJECUCIÓN DEL SERVICIO**

### 4.1 Proveedor confirma y se dirige

**Estado del Job**: `PROVIDER_EN_ROUTE` (Proveedor en camino)

**Tracking en tiempo real**:

- Mapa con ubicación del proveedor (GPS live)
- ETA actualizado cada 30 segundos
- Botón de "Llamar al proveedor"
- Botón de "Cancelar" (con penalización si ya salió)

### 4.2 Proveedor llega

**Check-in automático**: Geofencing (50m del cliente)

**Estado del Job**: `PROVIDER_ARRIVED` (Proveedor llegó)

**Notificación al cliente**:

```
🔔 ¡Tu mecánico llegó!
Nombre: Juan Pérez
Vehículo: Ford Transit - AB-12-34
Por favor confirmalo en la app
```

**Cliente confirma llegada** → Foto del proveedor + vehículo

### 4.3 Diagnóstico in-situ

**Estado del Job**: `DIAGNOSING` (Diagnosticando)

**Proveedor puede**:

- Actualizar diagnóstico
- Ajustar cotización (requiere re-aprobación si >10% diferencia)
- Agregar fotos/videos del problema
- Solicitar aprobación de repuestos adicionales

**Control de calidad**:

- Timer automático (tiempo real vs estimado)
- Alertas si excede 150% del tiempo estimado

### 4.4 Ejecución del trabajo

**Estado del Job**: `IN_PROGRESS` (Trabajo en progreso)

**Timeline visible para el cliente**:

```
✅ 10:30 - Proveedor llegó
✅ 10:35 - Diagnóstico completado
🔄 10:40 - Trabajo iniciado
⏳ 11:10 - Estimado de finalización
```

**Proveedor actualiza progreso**:

- Inicio de trabajo (foto "antes")
- Hitos intermedios
- Problemas encontrados
- Repuestos utilizados

---

## 📦 **FASE 5: ENTREGA Y VALIDACIÓN**

### 5.1 Proveedor finaliza trabajo

**Estado del Job**: `WORK_COMPLETED` (Trabajo finalizado)

**Checklist obligatorio del proveedor**:

- [ ] Foto "después" del trabajo
- [ ] Lista de repuestos instalados (con facturas)
- [ ] Garantía del trabajo (digital)
- [ ] Recomendaciones de mantenimiento
- [ ] Firma digital del cliente

### 5.2 Cliente valida entrega

**Inspección del cliente**:

```
Validación del servicio:

1. ¿El problema fue resuelto?
   ○ Sí, completamente
   ○ Parcialmente
   ○ No se resolvió

2. ¿Probaste el vehículo?
   ○ Sí, funciona bien
   ○ Aún presenta fallas

3. ¿Recibiste factura/boleta?
   ○ Sí
   ○ No (requerida)

[ACEPTAR TRABAJO] [REPORTAR PROBLEMA]
```

**Si hay problema**:

- Mediación automática
- Proveedor debe corregir SIN costo adicional
- Escalación a soporte RedMecánica
- Pago sigue RETENIDO

**Si todo está bien**:

- Cliente acepta trabajo
- **PAGO SE LIBERA** al proveedor (menos comisión 8-12%)

**Estado del Job**: `DELIVERED` (Entregado y aceptado)

---

## ⭐ **FASE 6: EVALUACIÓN Y CALIDAD**

### 6.1 Evaluación inmediata (Obligatoria)

**Formulario de evaluación** (máximo 5 minutos):

```
Califica tu experiencia:

1. Calidad del trabajo [1-5 estrellas]
   ⭐⭐⭐⭐⭐

2. Profesionalismo [1-5 estrellas]
   ⭐⭐⭐⭐⭐

3. Puntualidad [1-5 estrellas]
   ⭐⭐⭐⭐⭐

4. Relación precio/calidad [1-5 estrellas]
   ⭐⭐⭐⭐⭐

5. Limpieza y orden [1-5 estrellas]
   ⭐⭐⭐⭐⭐

Promedio: 4.8 ⭐

6. Comentario público (opcional):
   [textarea]

7. Retroalimentación privada para el proveedor (opcional):
   [textarea]

8. ¿Recomendarías este proveedor?
   ○ Definitivamente sí
   ○ Probablemente sí
   ○ No estoy seguro
   ○ Probablemente no
   ○ Definitivamente no

9. ¿Volverías a contratar este proveedor?
   ☑ Sí, guardar como favorito
```

**Incentivo**:

- 5% de descuento en próximo servicio por completar evaluación

### 6.2 Evaluación del proveedor al cliente (Opcional)

```
Califica a este cliente:
- Comunicación [1-5]
- Cumplió horario acordado [1-5]
- Pago a tiempo [1-5]
- Comentario privado
```

**Estado del Job**: `REVIEWED` (Evaluado)

---

## 🔄 **FASE 7: POST-VENTA Y SEGUIMIENTO**

### 7.1 Garantía activa

**Período de garantía** (según lo acordado):

- Email automático explicando garantía
- Botón "Usar garantía" visible en historial
- Si se usa dentro del período → Proveedor debe atender SIN COSTO

### 7.2 Seguimiento automático

**Timeline de seguimiento**:

**+24 horas**:

```
Email/Push:
¿Cómo va tu auto después del servicio?
- Todo perfecto ✅
- Tengo una duda
- El problema volvió 🔧
```

**+7 días**:

```
Recordatorio de mantenimiento:
Según el trabajo realizado, te recomendamos:
- Revisar nivel de aceite en 2 semanas
- Próximo cambio de filtros: 3 meses
```

**+30 días**:

```
¿Qué tal todo?
¿Tu vehículo sigue funcionando bien?
¿Necesitas programar mantención?

[Todo bien] [Necesito ayuda]
```

### 7.3 Programa de fidelización

**Beneficios por uso recurrente**:

- 5% descuento en 2do servicio
- 10% descuento en 5to servicio
- Prioridad en emergencias
- Descuentos con Prestadores aliados

**Estado del Job**: `CLOSED` (Cerrado - Ciclo completo)

---

## 🚨 **MANEJO DE CONFLICTOS Y MEDIACIÓN**

### Escenarios de conflicto:

#### 1. **Cliente no está satisfecho**

```
Flujo:
1. Cliente reporta problema
2. Proveedor tiene 24hrs para responder
3. Opciones:
   a) Proveedor acepta error → Corrige gratis
   b) Proveedor no acepta → Mediación RedMecánica
   c) No responde → Reembolso parcial/total + penalización
```

#### 2. **Trabajo toma mucho más tiempo**

```
Si excede 200% del tiempo:
- Proveedor debe explicar razón
- Cliente puede:
  a) Aceptar extensión
  b) Cancelar y buscar otro (cobra por tiempo trabajado)
  c) Pedir compensación por demora
```

#### 3. **Proveedor no llega**

```
Si no llega en 2x el ETA:
- Auto-cancelación
- Proveedor penalizado (-15 Trust Score)
- Búsqueda alternativa automática
- Cupón de descuento para el cliente
```

#### 4. **Cambio de precio en terreno**

```
Si aumento > 10%:
- Requiere nueva aprobación del cliente
- Cliente puede rechazar y pagar solo lo cotizado
- Si diferencia es razonable → Mediación
```

---

## 📊 **MÉTRICAS Y KPIs DE CALIDAD**

### Para el Sistema (RedMecánica):

**Eficiencia**:

- Tiempo promedio búsqueda → cotización: < 20 min
- Tiempo promedio cotización → inicio: < 45 min
- % trabajos completados exitosamente: > 95%

**Satisfacción**:

- NPS (Net Promoter Score): > 60
- Rating promedio de trabajos: > 4.5/5
- % de garantías usadas: < 5%

**Calidad**:

- % de conflictos: < 3%
- % de reembolsos: < 2%
- % de Prestadores activos con rating > 4.5: > 80%

### Para Prestadores:

**Rendimiento**:

- Tiempo de respuesta a solicitudes: < 10 min
- Puntualidad (llega en ETA ±15min): > 90%
- Trabajos completados vs cancelados: > 95%

**Calidad**:

- Rating promedio: > 4.5
- % de trabajos con problemas: < 5%
- Trust Score: > 70

### Para Clientes:

**Engagement**:

- % que completan evaluación: > 80%
- % de clientes recurrentes: > 40%
- % que recomiendan el servicio: > 70%

---

## 🔐 **MEDIDAS DE SEGURIDAD EN EL FLUJO**

### 1. **Verificación de identidad en cada paso**

- Check-in geográfico
- Foto del proveedor al llegar
- Código de confirmación (generado en app)

### 2. **Botón de pánico**

- Visible durante todo el servicio
- Alerta inmediata a soporte
- Conexión directa con carabineros (si es crítico)

### 3. **Grabación de timeline**

- Cada acción queda registrada con timestamp
- Inmutable (blockchain futuro)
- Disponible para auditorías

### 4. **Sistema de escrow inteligente**

```
Pago retenido hasta:
✅ Trabajo completado
✅ Cliente validó entrega
✅ No hay disputas abiertas
✅ Proveedor confirmó finalización
```

---

## 🎯 **MEJORAS SUGERIDAS AL FLUJO ACTUAL**

### 1. **Sistema de Pre-aprobación de Presupuesto**

**Problema**: Cliente no sabe cuánto gastar
**Solución**:

- Rango de precios históricos para cada servicio
- "Precio justo" calculado por IA
- Alerta si cotización está 30% sobre el promedio

### 2. **Clasificación de Urgencia Inteligente**

**Problema**: Todo parece "urgente"
**Solución**:

```
Nivel 1 (Emergencia 🚨):
- Motor no enciende en carretera
- Accidente
- Necesita grúa YA
→ Respuesta: < 15 minutos

Nivel 2 (Urgente ⚠️):
- Check engine encendido
- Ruidos extraños
- Batería débil
→ Respuesta: < 2 horas

Nivel 3 (Normal 🔧):
- Mantención programada
- Cambio de aceite
- Revisión técnica
→ Respuesta: < 24 horas
```

### 3. **Video-Diagnóstico Previo**

**Innovación**:

- Cliente hace videollamada con mecánico
- Diagnóstico preliminar GRATIS
- Reduce "visitas innecesarias"
- Cliente más informado

### 4. **Historial Médico del Vehículo**

**Valor agregado**:

- RedMecánica guarda TODOS los servicios
- Exportable en PDF
- Aumenta valor de reventa
- Recordatorios de mantención inteligentes

### 5. **Certificación de Trabajo Realizado**

**Diferenciador**:

- Certificado digital con QR
- Verificable por compradores futuros
- Incluye fotos antes/después
- Aumenta confianza en mercado de usados

### 6. **Programa "Segunda Opinión"**

**Para trabajos >$200,000**:

- Cliente puede pedir segunda opinión (gratis)
- Otro proveedor revisa diagnóstico
- Si hay discrepancia → Mediación experta

### 7. **Modo "Preventivo"**

**Suscripción mensual**:

- $15,000/mes
- Incluye: 2 diagnósticos + 1 servicio básico
- Prioridad en emergencias
- Descuentos exclusivos

---

## 🚀 **ROADMAP DE IMPLEMENTACIÓN**

### **FASE MVP (Mes 1-2)**:

✅ Búsqueda básica
✅ Cotización simple (1 proveedor)
✅ Estados básicos: PENDING → IN_PROGRESS → COMPLETED
✅ Pago contra-entrega
✅ Evaluación simple (1-5 estrellas)

### **FASE 2 (Mes 3-4)**:

✅ Comparación de cotizaciones (hasta 3)
✅ Tracking GPS en tiempo real
✅ Sistema de escrow (pago retenido)
✅ Garantías digitales
✅ Evaluación detallada

### **FASE 3 (Mes 5-6)**:

✅ Video-diagnóstico
✅ Historial del vehículo
✅ Programa de fidelización
✅ Mediación automática de conflictos

### **FASE 4 (Mes 7-9)**:

✅ IA para pricing justo
✅ Certificados digitales
✅ Segunda opinión
✅ Suscripción preventiva

### **FASE 5 (Mes 10-12)**:

✅ Blockchain para certificados
✅ Marketplace de repuestos
✅ Expansión a flotas empresariales
✅ API pública

---

**Versión**: 2.0  
**Autor**: Equipo RedMecánica  
**Fecha**: 08/02/2026
