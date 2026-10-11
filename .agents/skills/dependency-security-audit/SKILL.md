---
name: dependency-security-audit
description: Auditoría y actualización proactiva de dependencias para prevenir vulnerabilidades de seguridad (CVEs, npm audit) antes de despliegues y commits.
---

# Habilidad: Auditoría y Remediación Continua de Seguridad en Dependencias

Esta habilidad establece como regla obligatoria auditar y asegurar que todas las dependencias del proyecto no contengan vulnerabilidades conocidas (CVEs) antes de realizar cualquier commit, merge o deploy a producción (Hostinger/Vercel/servidores).

## Principios Obligatorios

1. **Chequeo Proactivo Antes de Commits**:
   - Siempre ejecutar `npm audit` antes de dar por finalizada cualquier tarea o mejora de escalabilidad.
   - Si se detectan alertas críticas, altas o moderadas con parches disponibles, se deben aplicar las actualizaciones correspondientes.

2. **Estrategia de Parcheo en Monorepo**:
   - Para dependencias directas (`frontend`, `backend`, `shared`):
     - Actualizar la versión en sus respectivos `package.json` a la versión mínima segura indicada por el reporte de seguridad o advisory de npm.
   - Para dependencias transitivas / anidadas:
     - Utilizar la sección `"overrides"` en la raíz de [package.json](file:///c:/workspace/RedMecanica/package.json) para forzar la resolución uniforme de la versión segura en todo el árbol de dependencias.

3. **Verificación de Regresiones y Build**:
   - Tras actualizar o aplicar overrides:
     1. Ejecutar `npm run build` en los workspaces relevantes (`shared`, `frontend`, `backend`).
     2. Ejecutar la batería de pruebas de integración (`node backend/scripts/test-flows.mjs`) para garantizar que la nueva versión del paquete no rompa flujos de autenticación, sockets o llamadas HTTP.

4. **Registro y Transparencia**:
   - Informar al usuario en cada ciclo de trabajo el estado del escaneo de seguridad y los paquetes actualizados.
