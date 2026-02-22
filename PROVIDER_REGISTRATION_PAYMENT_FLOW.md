# 🎯 Flujo de Registro y Pago de Prestadores

## Resumen de Implementación

Se ha implementado un flujo completo de registro y pago para prestadores que garantiza:

1. ✅ Los usuarios DEBEN registrarse antes de contratar un plan
2. ✅ Los planes gratuitos se activan inmediatamente
3. ✅ Los planes de pago redirigen al checkout después del registro
4. ✅ El plan seleccionado se persiste entre vistas usando localStorage

---

## 📋 Flujo Completo

### Escenario 1: Usuario No Registrado Selecciona Plan Gratuito

```
1. Usuario hace clic en "Comenzar Gratis" (Plan Básico)
   └─> PricingPlans detecta que no está registrado

2. Muestra confirmación:
   "¡Perfecto! Primero necesitamos que completes tu registro como proveedor"

3. Usuario acepta
   └─> Guarda plan en localStorage: { planId: 'free', billingCycle: 'monthly' }
   └─> Navega a ProviderOnboarding

4. Usuario completa el registro (4 pasos)

5. Al finalizar el registro:
   └─> ProviderOnboarding detecta plan guardado
   └─> Limpia localStorage
   └─> Muestra: "¡Registro exitoso! Tu plan Básico está activo"
   └─> Redirige al Dashboard de Proveedor
```

### Escenario 2: Usuario No Registrado Selecciona Plan de Pago

```
1. Usuario hace clic en "Seleccionar Plan" (Profesional/Premium)
   └─> PricingPlans detecta que no está registrado

2. Muestra confirmación:
   "Has seleccionado el plan [Nombre]. Primero necesitamos que completes
    tu registro. El pago se solicitará después del registro."

3. Usuario acepta
   └─> Guarda plan en localStorage: { planId: 'pro', billingCycle: 'annual' }
   └─> Navega a ProviderOnboarding

4. Usuario completa el registro (4 pasos)

5. Al finalizar el registro:
   └─> ProviderOnboarding detecta plan de pago guardado
   └─> Limpia localStorage
   └─> Muestra confirmación: "¡Registro exitoso! Has seleccionado el plan [Nombre].
                              Ahora serás redirigido para completar el pago."

6. Usuario acepta pago
   └─> Abre modal de pago (simulado por ahora)
   └─> En producción: Redirige a Webpay/Mercado Pago
```

### Escenario 3: Usuario YA Registrado Selecciona Plan Gratuito

```
1. Usuario hace clic en "Comenzar Gratis"
   └─> PricingPlans detecta que YA está registrado

2. Activa el plan inmediatamente
   └─> Muestra: "¡Genial! Tu plan Básico está activo. Puedes comenzar
                 a recibir solicitudes de inmediato."
   └─> Llama a onSelectPlan('free')
```

### Escenario 4: Usuario YA Registrado Selecciona Plan de Pago

```
1. Usuario hace clic en "Seleccionar Plan" (Pro/Premium)
   └─> PricingPlans detecta que YA está registrado

2. Abre modal de pago inmediatamente
   └─> Muestra resumen del plan
   └─> Muestra total a pagar
   └─> Botón "Proceder al Pago"

3. Usuario confirma pago
   └─> Redirige a pasarela de pago (Webpay en producción)
   └─> Procesa pago
   └─> Al completar: Activa el plan y llama a onSelectPlan(planId)
```

### Escenario 5: Plan Empresarial

```
1. Usuario hace clic en "Contactar Ventas"
   └─> Abre email automático: ventas@redmecanica.cl
   └─> Subject: "Consulta Plan Empresarial"
   └─> No requiere registro previo
```

---

## 🔧 Componentes Modificados

### 1. **PricingPlans.tsx**

#### Estados Nuevos:

```typescript
const [showPaymentModal, setShowPaymentModal] = useState(false);
const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<any>(null);
const [isProviderRegistered, setIsProviderRegistered] = useState(false);
```

#### Nueva Prop:

```typescript
interface PricingPlansProps {
  onNavigateToOnboarding?: () => void; // Para navegar al onboarding
}
```

#### Lógica de Selección:

```typescript
const handleSelectPlan = (planId: string) => {
  // 1. Plan empresarial -> Email directo
  // 2. No registrado -> Guardar en localStorage y navegar a onboarding
  // 3. Registrado + Plan gratis -> Activar inmediatamente
  // 4. Registrado + Plan de pago -> Abrir modal de pago
};
```

#### Modal de Pago:

- Muestra resumen del plan seleccionado
- Total a pagar con formato chileno
- Comisión por servicio
- Botón de pago con gradiente purple-blue
- Icono de seguridad (🔒 Webpay Plus)

### 2. **ProviderOnboarding.tsx**

#### Modificaciones en handleSubmit:

```typescript
const handleSubmit = async () => {
  await registerProvider(formData);

  // Verificar localStorage
  const savedPlan = localStorage.getItem("selectedPlan");

  if (savedPlan) {
    const { planId, billingCycle } = JSON.parse(savedPlan);
    localStorage.removeItem("selectedPlan");

    if (planId === "free") {
      // Activar plan gratis
    } else {
      // Confirmar pago y redirigir
    }
  }

  onComplete();
};
```

### 3. **App.tsx**

#### Nueva Prop para PricingPlans:

```typescript
<PricingPlans
  onClose={() => setCurrentView('home')}
  onNavigateToOnboarding={() => setCurrentView('provider-onboarding')}
/>
```

---

## 💾 Persistencia de Datos

### LocalStorage

```typescript
// Guardar plan seleccionado
localStorage.setItem(
  "selectedPlan",
  JSON.stringify({
    planId: "pro",
    billingCycle: "annual",
  }),
);

// Recuperar plan guardado
const savedPlan = localStorage.getItem("selectedPlan");
const { planId, billingCycle } = JSON.parse(savedPlan);

// Limpiar después de usar
localStorage.removeItem("selectedPlan");
```

### Estado del Usuario (Mock)

```typescript
// En PricingPlans
const [isProviderRegistered, setIsProviderRegistered] = useState(false);

// En Producción, esto vendría de:
// - Context API (UserContext)
// - Redux/Zustand store
// - O consulta al backend: GET /api/users/me
```

---

## 🎨 Modal de Pago

### Características:

- ✅ Fondo overlay oscuro (bg-black bg-opacity-50)
- ✅ Card centrado con max-width
- ✅ Icono del plan (emoji grande)
- ✅ Nombre del plan
- ✅ Total destacado con gradiente purple-blue
- ✅ Detalles del plan (ciclo, comisión)
- ✅ Botón de pago con gradiente
- ✅ Botón de cancelar
- ✅ Icono de seguridad Webpay

### Ejemplo Visual:

```
┌─────────────────────────────────────────┐
│              ⭐                          │
│        Plan Profesional                 │
│         Pago Mensual                    │
│                                         │
│  ╔═══════════════════════════════╗     │
│  ║     Total a pagar             ║     │
│  ║       $29.900                 ║     │
│  ║      por mes                  ║     │
│  ╚═══════════════════════════════╝     │
│                                         │
│  Plan: Profesional                      │
│  Ciclo: Mensual                         │
│  Comisión: 10%                          │
│                                         │
│  [   Proceder al Pago   ] (gradient)   │
│  [      Cancelar        ] (gray)       │
│                                         │
│  🔒 Pago seguro procesado por Webpay   │
└─────────────────────────────────────────┘
```

---

## 🚀 Integración con Backend (Próximos Pasos)

### 1. Verificar Estado del Usuario

```typescript
// En PricingPlans useEffect
useEffect(() => {
  const checkUserStatus = async () => {
    try {
      const response = await fetch("/api/users/me");
      const user = await response.json();

      setIsProviderRegistered(!!user.serviceProvider);
      setUserProviderStatus(user.serviceProvider?.status || "none");
    } catch (error) {
      console.error(error);
    }
  };

  checkUserStatus();
}, []);
```

### 2. Procesamiento de Pago Real

```typescript
const handlePayment = async () => {
  try {
    // Crear orden de pago en backend
    const response = await fetch("/api/payments/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        planId: selectedPlanForPayment.id,
        billingCycle: selectedPlanForPayment.billingCycle,
        amount: displayPrice,
      }),
    });

    const { paymentUrl } = await response.json();

    // Redirigir a Webpay
    window.location.href = paymentUrl;
  } catch (error) {
    alert("Error al procesar el pago");
  }
};
```

### 3. Webhook de Confirmación

```typescript
// Backend: POST /api/webhooks/payment-success
app.post("/api/webhooks/payment-success", async (req, res) => {
  const { userId, planId, transactionId } = req.body;

  // Activar plan del usuario
  await prisma.serviceProvider.update({
    where: { userId },
    data: {
      currentPlan: planId,
      planActivatedAt: new Date(),
      transactionId,
    },
  });

  res.json({ success: true });
});
```

---

## 📊 Testing del Flujo

### Test Manual 1: Plan Gratuito (No Registrado)

1. Ir a `/pricing`
2. Clic en "Comenzar Gratis"
3. Aceptar confirmación
4. Completar onboarding (4 pasos)
5. Verificar mensaje de éxito
6. Debe redirigir a dashboard de proveedor

### Test Manual 2: Plan de Pago (No Registrado)

1. Ir a `/pricing`
2. Cambiar a "Anual"
3. Clic en "Seleccionar Plan" (Profesional)
4. Aceptar confirmación
5. Completar onboarding
6. Verificar mensaje de pago pendiente
7. Aceptar pago
8. Verificar redirección (simulada)

### Test Manual 3: Cambiar Estado Mock

Para probar como usuario registrado:

```typescript
// En PricingPlans.tsx, línea ~16
const [isProviderRegistered, setIsProviderRegistered] = useState(true); // Cambiar a true
```

---

## 🎯 Ventajas del Flujo Implementado

✅ **Claridad**: Usuario sabe exactamente qué va a pasar  
✅ **Seguridad**: No se puede pagar sin estar registrado  
✅ **Flexibilidad**: Funciona con o sin registro previo  
✅ **Persistencia**: El plan seleccionado no se pierde al navegar  
✅ **UX**: Mensajes claros en cada paso, sin confusión  
✅ **Escalabilidad**: Fácil integrar con pasarelas de pago reales

---

## 🔐 Consideraciones de Seguridad

1. **Validación de planes**: Backend debe validar que el planId sea válido
2. **Verificación de pago**: Webhook debe verificar firma de Webpay
3. **Prevención de fraude**: Registrar transactionId en cada pago
4. **Timeout**: Limpiar planes guardados en localStorage después de 24h
5. **Estado del proveedor**: Verificar que esté APPROVED antes de aceptar pagos

---

## 📝 Modelo de Negocio Implementado

### Plan Básico (Gratis):

- ❌ Sin costo de suscripción
- ✅ 15% de comisión por servicio completado
- ✅ Activación inmediata

### Plan Profesional ($29.900/mes):

- ✅ Costo de suscripción mensual/anual
- ✅ 10% de comisión por servicio (reducida)
- ✅ Requiere pago antes de activación

### Plan Premium ($59.900/mes):

- ✅ Costo de suscripción mensual/anual
- ✅ 7% de comisión por servicio (ultra-reducida)
- ✅ Requiere pago antes de activación

### Plan Empresarial (A medida):

- ✅ Negociación directa con ventas
- ✅ Comisión desde 5% (negociable)
- ✅ Sin proceso automático

---

## 🎉 Estado Actual

- ✅ Flujo de registro completo
- ✅ Detección de estado del usuario
- ✅ Persistencia con localStorage
- ✅ Modal de pago diseñado
- ✅ Mensajes contextuales
- ⚠️ Integración con Webpay (pendiente)
- ⚠️ Verificación de estado en backend (pendiente)
- ⚠️ Webhooks de confirmación (pendiente)
