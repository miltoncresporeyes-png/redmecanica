# Plan de Validación y Seguridad de Prestadores - RedMecánica

## 🎯 Objetivo

Garantizar que solo Prestadores confiables, verificados y competentes puedan ofrecer servicios en la plataforma.

---

## 📋 Estados del Proveedor

### 1. **PENDING** (Inicial)

- Registro completado, esperando envío de documentos
- No puede aparecer en búsquedas
- No puede recibir trabajos

### 2. **UNDER_REVIEW** (En Revisión)

- Documentos enviados, esperando aprobación manual
- Equipo de revisión evalúa documentación
- SLA: 24-48 horas hábiles

### 3. **APPROVED** (Aprobado pero...)

- Documentos aprobados
- En "modo prueba" - primeros 5 trabajos supervisados
- Límite inicial: $100,000 CLP por trabajo
- **NO** aparece en búsquedas públicas todavía

### 4. **ACTIVE** (Activo)

- Completó período de prueba exitosamente
- Rating mínimo: 4.0/5.0
- **SÍ** aparece en búsquedas públicas
- Puede aceptar trabajos sin límite

### 5. **SUSPENDED** (Suspendido)

- Violación de políticas o calificación muy baja
- No aparece en búsquedas
- No puede aceptar nuevos trabajos
- Trabajos activos deben completarse

### 6. **REJECTED** (Rechazado)

- Documentación falsa o incompleta
- Antecedentes penales
- No cumple requisitos mínimos
- Puede re-aplicar después de 6 meses

---

## 🔐 Niveles de Validación

### **Nivel 1: Validación Automática (Inmediata)**

#### A. Verificación de Identidad

- ✅ **RUT Chileno Válido**
  - Validación de dígito verificador
  - Consulta a API del Registro Civil (si disponible)
  - Cross-check con nombre completo

- ✅ **Email Verificado**
  - Envío de código de 6 dígitos
  - Válido por 15 minutos
  - Máximo 3 intentos

- ✅ **Teléfono Verificado**
  - SMS con código de 4 dígitos
  - Servicio: Twilio / AWS SNS
  - Registro del número como "verificado"

#### B. Validaciones Básicas

- Completitud de perfil (mínimo 80%)
- Foto de perfil profesional
- Descripción mínima de 50 caracteres

---

### **Nivel 2: Documentación Obligatoria**

#### A. Para TODOS los Prestadores:

1. **Cédula de Identidad (Foto por ambos lados)**
   - Formato: JPG/PNG/PDF
   - Tamaño máximo: 5MB
   - Verificación: OCR automático + revisión manual
   - Vigencia: Permanente (hasta vencimiento de cédula)

2. **Certificado de Antecedentes**
   - Emisión: Registro Civil de Chile
   - Antigüedad máxima: 3 meses
   - Renovación: Cada 6 meses obligatoria
   - ⚠️ **Automático rechazo** si hay delitos graves

3. **Foto del Vehículo (si es mecánico móvil o grúa)**
   - Patente visible
   - 4 ángulos del vehículo
   - Herramientas/equipo visible

#### B. Específico por tipo:

**MECHANIC (Móvil)**

- Permiso de circulación vigente
- Revisión técnica al día
- Foto de kit de herramientas

**WORKSHOP (Taller)**

- Permiso municipal de funcionamiento
- Patente comercial
- Certificado de prevención de riesgos
- Seguro de responsabilidad civil ($5.000.000 CLP mínimo)
- Fotos del establecimiento (3 mínimo)

**TOWING (Grúa)**

- Permiso especial de transporte
- Seguro TODO RIESGO obligatorio
- Certificación técnica del vehículo
- Licencia clase A2 del conductor

**INSURANCE (Aseguradora)**

- RUT de empresa
- Certificado de vigencia CMF (Comisión para el Mercado Financiero)
- Pólizas ofrecidas

---

### **Nivel 3: Revisión Manual (24-48 hrs)**

#### Checklist del Revisor:

- [ ] Documentos legibles y no adulterados
- [ ] Coincidencia de datos (nombre, RUT, foto)
- [ ] Certificado de antecedentes sin delitos graves
- [ ] Permisos vigentes
- [ ] Seguros adecuados (si aplica)
- [ ] Perfil completo y profesional
- [ ] Referencias laborales (si disponible)

#### Aprobación / Rechazo:

- **Aprobado** → Pasa a estado `APPROVED`
- **Rechazado** → Email con razón específica, puede re-aplicar

---

### **Nivel 4: Período de Prueba (Sistema de Confianza Progresiva)**

#### Primeros 5 Trabajos Supervisados:

1. **Límites Iniciales**
   - Máximo $100,000 CLP por trabajo
   - Solo servicios "simples" (cambio aceite, diagnóstico, etc.)
   - No trabajos de emergencia

2. **Supervisión**
   - Llamada de seguimiento post-servicio (automática)
   - Email pidiendo calificación inmediata
   - Análisis de comportamiento

3. **Criterios de Graduación**
   - 5 trabajos completados sin incidentes
   - Calificación promedio ≥ 4.5/5.0
   - Rating de 0 quejas/reclamos
   - Tiempo de respuesta < 30 minutos

4. **Activación Completa**
   - Pasa de `APPROVED` → `ACTIVE`
   - Sin límites de valor
   - Aparece en búsquedas públicas

---

## 📊 Sistema de Trust Score (Puntaje de Confianza)

### Cálculo Inicial: 50/100

### Factores que Aumentan (+):

- ✅ Email verificado: +5
- ✅ Teléfono verificado: +5
- ✅ Documentos completos: +10
- ✅ Seguro vigente: +10
- ✅ Certificaciones adicionales: +5 c/u
- ✅ Trabajo completado exitoso: +3
- ✅ Calificación 5 estrellas: +2

### Factores que Disminuyen (-):

- ❌ Trabajo cancelado por proveedor: -5
- ❌ Queja del cliente: -10
- ❌ Calificación < 3 estrellas: -5
- ❌ Documento vencido: -15
- ❌ Retraso > 30 min sin aviso: -3

### Umbrales:

- **< 30** → Suspensión automática
- **30-50** → Revisión manual
- **50-70** → Normal
- **70-85** → Proveedor destacado
- **85-100** → "Elite" - badges especiales

---

## 🚨 Banderas Rojas (Auto-Rechazo)

1. Antecedentes penales graves
2. Documentos claramente falsificados
3. RUT inválido o de otra persona
4. Sin seguro obligatorio (talleres/grúas)
5. Múltiples quejas en otras plataformas (búsqueda manual)

---

## 🔄 Proceso de Re-validación Periódica

### Cada 6 meses:

- Renovación de certificado de antecedentes
- Actualización de seguros
- Revisión de calificaciones

### Si no cumple:

- Pasa a `SUSPENDED`
- 15 días para actualizar
- Si no actualiza → `REJECTED`

---

## 🛠️ Herramientas Técnicas Sugeridas

### Para Verificación de Identidad:

- **RUT Validation**: Librería `rut.js` o API propia
- **OCR**: AWS Textract, Google Vision API
- **SMS**: Twilio, AWS SNS
- **Email**: SendGrid, AWS SES

### Para Almacenamiento de Documentos:

- **Encriptación**: AES-256
- **Storage**: AWS S3 con ciclo de vida
- **Acceso**: Pre-signed URLs con expiración

### Para Machine Learning (Futuro):

- Detección de documentos falsos
- Análisis de comportamiento anómalo
- Predicción de rating

---

## 📈 KPIs de Validación

- Tiempo promedio de aprobación: < 24 hrs
- % de falsos positivos: < 2%
- % de Prestadores que completan período prueba: > 80%
- % de Prestadores activos con Trust Score > 70: > 90%

---

## 💡 Recomendaciones Adicionales

### Fase 1 (MVP - Ahora):

- Validación manual básica
- Estados: PENDING, UNDER_REVIEW, ACTIVE, SUSPENDED
- Documentos obligatorios mínimos

### Fase 2 (3-6 meses):

- OCR automático
- Sistema de Trust Score
- Período de prueba automatizado

### Fase 3 (6-12 meses):

- Machine Learning para detección de fraude
- Integración con APIs gubernamentales
- Background checks internacionales (si aplica)

---

**Última actualización**: 08/02/2026  
**Versión**: 1.0  
**Responsable**: Equipo de Seguridad RedMecánica
