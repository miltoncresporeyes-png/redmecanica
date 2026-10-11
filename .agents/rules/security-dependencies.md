# Reglas de Seguridad y Mantenimiento de Dependencias

1. **Auditoría Obligatoria de Seguridad**:
   - En cualquier tarea que involucre cambios de código, nuevas características, refactorizaciones o preparativos para deploy, es obligatorio verificar que las dependencias no contengan vulnerabilidades de seguridad reportadas (`npm audit`).
   - Las vulnerabilidades críticas y altas deben resolverse de inmediato mediante actualización de versión en `package.json` o mediante `overrides` en el `package.json` raíz para dependencias anidadas/transitivas.

2. **Garantía de Estabilidad tras Actualización**:
   - Toda actualización de paquetes de seguridad debe ser validada con:
     1. Compilación del proyecto (`npm run build -w frontend`, `tsc` en backend).
     2. Ejecución de la batería de pruebas de flujos críticos (`node backend/scripts/test-flows.mjs`).
