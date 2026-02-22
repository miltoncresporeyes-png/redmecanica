# 🚀 Guía de Finalización de Migración: Backend Hardening

Hemos completado la actualización del código (Auth + Postgres), pero el servidor de desarrollo en ejecución está bloqueando los archivos de base de datos. Sigue estos pasos para finalizar:

1.  **Detén todos los procesos de node**: Presiona `Ctrl+C` en tus terminales donde corre `npm run dev`.
2.  **Verifica Docker**: Asegúrate de que tu contenedor de DB esté corriendo:
    ```bash
    docker-compose up -d
    ```
3.  **Ejecuta la Migración**:
    ```bash
    cd backend
    npx prisma db push
    ```
4.  **Ejecuta el Seed (Datos de prueba)**:
    ```bash
    npx prisma db seed
    ```
5.  **Reinicia el Servidor**:
    ```bash
    npm run dev
    ```

¡Listo! Tu backend ahora estará corriendo sobre PostgreSQL con Autenticación JWT segura.
