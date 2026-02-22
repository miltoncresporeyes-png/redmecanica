# Guía de Prueba Manual - Sistema de Dashboards Diferenciados

## 🎯 Objetivo

Verificar que el sistema de dashboards muestra correctamente diferentes interfaces según el rol del usuario.

## 📋 Pasos de Prueba

### Prueba 1: Dashboard de Cliente (Por Defecto)

1. **Abrir la aplicación**: Navega a `http://localhost:3000` en tu navegador
2. **Hacer clic en "Mi Cuenta"**: Busca el botón en el header (esquina superior derecha)
3. **Observar el loading**: Deberías ver un spinner de carga por ~500ms
4. **Verificar el Dashboard de Cliente**:
   - ✅ Header azul con el texto "Mi Cuenta" y "Panel de Cliente"
   - ✅ Tres pestañas visibles:
     - 👤 Perfil
     - 🚗 Vehículos
     - 📋 Historial
   - ✅ En la pestaña "Perfil":
     - Formulario con datos personales (Nombre, RUT, Email, Teléfono, Dirección, Región, Comuna)
     - Botón "Editar" (cambia a "Guardar" y "Cancelar" cuando se activa)
   - ✅ En la pestaña "Vehículos":
     - Cards mostrando vehículos (Toyota Corolla 2020, Chevrolet Spark 2018)
     - Botón "+ Agregar Vehículo"
   - ✅ En la pestaña "Historial":
     - Lista de servicios completados
     - Total invertido este año en un card destacado

### Prueba 2: Dashboard de Proveedor

1. **Modificar el mock data**:
   - Abrir: `frontend/components/AccountHub.tsx`
   - Ir a la línea ~36 (dentro de `mockUser`)
   - Cambiar `role: 'USER'` por `role: 'PROVIDER'`
   - Guardar el archivo (Vite recargará automáticamente)

2. **Refrescar la página** en el navegador

3. **Hacer clic en "Mi Cuenta"** nuevamente

4. **Verificar el Dashboard de Proveedor**:
   - ✅ Header con gradiente multicolor (indigo→purple→blue)
   - ✅ Texto "Panel de Proveedor" y "Gestiona tu negocio y maximiza tus ganancias"
   - ✅ Toggle de disponibilidad (DISPONIBLE/NO DISPONIBLE) en el header
   - ✅ Cuatro pestañas visibles:
     - 📊 Resumen
     - 🔧 Trabajos Activos
     - 📈 Análisis
     - 🕐 Horarios

5. **Pestaña "Resumen"** (debe mostrar):
   - ✅ 4 cards principales con gradientes de colores:
     - Verde: Ganancias Hoy ($154k, 3 trabajos)
     - Azul: Esta Semana ($892k, 18 trabajos)
     - Púrpura: Este Mes ($3,245k, 67 trabajos)
     - Amarillo: Calificación (⭐ 4.8, 234 reseñas)
   - ✅ 3 cards de rendimiento:
     - Tiempo de Respuesta (12 min)
     - Tasa de Finalización (98%)
     - Trabajos Activos (2)
   - ✅ Gráfica de barras con ganancias semanales
     - Barras azules con degradado
     - Valores debajo de cada barra (Lun-Dom)

6. **Pestaña "Trabajos Activos"** (debe mostrar):
   - ✅ 2 cards de trabajos activos:
     1. Cambio de aceite - Toyota Corolla 2020 - Estado: "En camino"
     2. Revisión de frenos - Honda Civic 2019 - Estado: "En progreso"
   - ✅ Cada card muestra:
     - Nombre del servicio y vehículo
     - Cliente
     - Estado (badge azul)
     - Pago ($45,000 / $85,000 en verde)
     - ETA
     - Botones: "Llegué"/"Finalizar" (verde) y "Contactar" (gris)

7. **Pestaña "Análisis"** (debe mostrar):
   - ✅ Card "Servicios Más Solicitados":
     - Barras de progreso horizontales con porcentajes
     - 4 servicios listados con cantidad y revenue
   - ✅ Card "Clientes Recurrentes":
     - 3 clientes con avatares circulares
     - Cantidad de servicios y gasto total
   - ✅ Card "Reseñas Recientes":
     - 3 reseñas con estrellas y comentarios

8. **Pestaña "Horarios"** (debe mostrar):
   - ✅ Editor de horarios por día de la semana
   - ✅ Cada día tiene:
     - Checkbox para activar/desactivar
     - Inputs de hora de inicio y fin (si está activado)
     - Texto "Cerrado" (si está desactivado)
   - ✅ Domingo debe estar desactivado por defecto
   - ✅ Card azul con consejo sobre horarios consistentes
   - ✅ Botón "Guardar Cambios" arriba

## ✅ Checklist de Verificación

### Visual:

- [ ] Los gradientes se ven correctamente
- [ ] Las transiciones de hover funcionan
- [ ] Los tabs cambian de contenido correctamente
- [ ] No hay errores de consola en el navegador

### Funcional:

- [ ] El toggle de disponibilidad cambia de estado visualmente
- [ ] Los checkboxes de horarios se pueden activar/desactivar
- [ ] Los inputs de tiempo se pueden editar
- [ ] Los botones tienen efectos hover

### Responsive:

- [ ] El dashboard se ve bien en pantalla completa
- [ ] El dashboard se adapta a ventanas más pequeñas
- [ ] Los grids se reorganizan en mobile (si aplica)

## 🐛 Errores Comunes a Buscar

1. **Texto cortado o superpuesto**: Verificar que todos los textos se lean completamente
2. **Cards sin gradiente**: Asegurarse que los colores de fondo se apliquen
3. **Gráfica de barras sin altura**: Las barras deberían tener alturas proporcionales
4. **Tabs que no cambian**: Verificar que el click en tabs cambie el contenido

## 📸 Capturas Recomendadas

Toma capturas de pantalla de:

1. Dashboard de Cliente - Pestaña Perfil
2. Dashboard de Cliente - Pestaña Historial (con el total invertido visible)
3. Dashboard de Proveedor - Pestaña Resumen (con todas las métricas)
4. Dashboard de Proveedor - Pestaña Análisis
5. Dashboard de Proveedor - Pestaña Horarios

## 🔄 Volver al Dashboard de Cliente

Para volver a ver el dashboard de cliente:

1. Abrir `frontend/components/AccountHub.tsx`
2. Cambiar `role: 'PROVIDER'` de vuelta a `role: 'USER'`
3. Guardar y refrescar el navegador

## 📝 Notas

- El sistema usa **datos mock** por ahora
- La integración con el backend real se hará en el siguiente paso
- Los horarios y configuraciones **no se guardan** todavía (solo visual)
