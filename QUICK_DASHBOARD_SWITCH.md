# 🔄 Cambio Rápido Entre Dashboards (Para Desarrollo)

## Opción 1: Modificar AccountHub (Recomendado)

### Para ver el Dashboard de Cliente:

**Archivo**: `frontend/components/AccountHub.tsx`  
**Línea**: ~36

```typescript
const mockUser = {
  id: "123",
  name: "Juan Pérez",
  email: "juan@example.com",
  role: "USER", // ← Cambiar a 'USER'
  hasProviderProfile: false,
};
```

### Para ver el Dashboard de Proveedor:

**Archivo**: `frontend/components/AccountHub.tsx`  
**Línea**: ~36

```typescript
const mockUser = {
  id: "123",
  name: "Taller El Rápido",
  email: "contacto@elrapido.cl",
  role: "PROVIDER", // ← Cambiar a 'PROVIDER'
  hasProviderProfile: true,
};
```

**Guardas el archivo** → Vite recarga automáticamente → Refrescas en el navegador

---

## Opción 2: Componente de Debug (Crear)

Crear un archivo `frontend/components/DashboardSwitcher.tsx`:

```typescript
import React, { useState } from 'react';
import ClientDashboard from './ClientDashboard';
import ProviderDashboard from './ProviderDashboard';

const DashboardSwitcher: React.FC = () => {
  const [view, setView] = useState<'client' | 'provider'>('client');

  return (
    <div>
      {/* Controles de desarrollo */}
      <div className="fixed top-4 right-4 z-50 bg-white p-4 rounded-lg shadow-lg border-2 border-purple-500">
        <p className="font-bold mb-2 text-sm">🔧 Debug Mode</p>
        <div className="flex gap-2">
          <button
            onClick={() => setView('client')}
            className={`px-3 py-1 rounded text-sm ${
              view === 'client'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Cliente
          </button>
          <button
            onClick={() => setView('provider')}
            className={`px-3 py-1 rounded text-sm ${
              view === 'provider'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Proveedor
          </button>
        </div>
      </div>

      {/* Dashboards */}
      {view === 'client' ? <ClientDashboard /> : <ProviderDashboard />}
    </div>
  );
};

export default DashboardSwitcher;
```

Luego en `App.tsx`, temporalmente reemplazar:

```typescript
case 'profile':
  return <DashboardSwitcher />;
```

---

## Opción 3: Query Params en URL (Avanzado)

Modificar `AccountHub.tsx` para leer parámetros de URL:

```typescript
useEffect(() => {
  const fetchUserData = async () => {
    // Leer parámetro de URL para testing
    const urlParams = new URLSearchParams(window.location.search);
    const debugRole = urlParams.get("role");

    if (debugRole === "provider") {
      setUserData({ role: "PROVIDER" });
      setUserRole("provider");
      return;
    }

    // Resto del código normal...
  };

  fetchUserData();
}, []);
```

Luego navegar a:

- **Cliente**: `http://localhost:3000/?role=client`
- **Proveedor**: `http://localhost:3000/?role=provider`

---

## Opción 4: Variable de Entorno

Crear `.env.local` en `/frontend`:

```bash
VITE_DEBUG_ROLE=provider
```

Y en `AccountHub.tsx`:

```typescript
const debugRole = import.meta.env.VITE_DEBUG_ROLE;

if (debugRole === "provider") {
  setUserRole("provider");
} else if (debugRole === "client") {
  setUserRole("client");
} else {
  // Lógica normal de detección de rol
}
```

**Cambiar rol**: Modificar `.env.local` y reiniciar el servidor (`npm run dev`)

---

## 🎯 Método Recomendado para Desarrollo

**Para testing rápido**: Opción 1 (modificar mockUser)  
**Para demo/presentación**: Opción 2 (DashboardSwitcher con botones)  
**Para QA/testing formal**: Opción 3 (Query params)

---

## 🚀 En Producción (Backend Real)

Cuando se integre con el backend, el flujo será:

```typescript
// AccountHub.tsx
const fetchUserData = async () => {
  const response = await fetch("/api/users/me", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const userData = await response.json();

  // El backend determina el rol
  if (userData.role === "PROVIDER" || userData.serviceProvider) {
    setUserRole("provider");
  } else {
    setUserRole("client");
  }
};
```

No será necesario cambiar código manualmente, el rol vendrá del token de autenticación.

---

## 📝 Nota Importante

**ANTES DE HACER COMMIT**: Asegúrate de que `AccountHub.tsx` esté configurado con:

- `role: 'USER'` (para que nuevos usuarios vean el dashboard de cliente por defecto)
- O mejor aún, comentar el mock y descomentar la lógica real del API

```typescript
// DEVELOPMENT ONLY - comentar antes de production
const mockUser = {
  role: "USER", // Default para nuevos usuarios
  hasProviderProfile: false,
};
```
