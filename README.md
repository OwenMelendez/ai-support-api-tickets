# AI-Powered Support Co-Pilot

Sistema de tickets de soporte con análisis de IA en tiempo real desarrollado para la prueba técnica.

## URLs del Proyecto

- **Dashboard Frontend**: https://aidashboardweb.netlify.app/
- **API Backend**: https://ai-support-api-tickets.onrender.com/docs

## Descripción

Sistema end-to-end que procesa tickets de soporte utilizando:

- **IA (Groq/Llama 3.3)** para clasificación automática de categoría y análisis de sentimiento
- **Actualización en tiempo real** mediante Supabase Realtime
- **Automatización con n8n** para notificaciones de tickets negativos
- **Dashboard interactivo** con React y TypeScript

## Arquitectura

```
Usuario → Webhook n8n → API FastAPI (IA) → Supabase → Dashboard React
                              ↓
                      Si sentimiento negativo
                              ↓
                      Email + Log en DB
```

## Estrategia de Prompt Engineering

### Diseño del Prompt

El prompt del sistema fue diseñado con las siguientes técnicas:

1. **Instrucciones Claras y Específicas**: Se define explícitamente el rol del modelo como "experto en clasificación de tickets de soporte técnico"

2. **Formato Estructurado**: Se solicita una respuesta JSON específica con dos campos: `category` y `sentiment`

3. **Restricción de Valores**: Se limitan las opciones a categorías específicas (Técnico, Facturación, Comercial) y sentimientos (Positivo, Neutral, Negativo)

4. **Ejemplos Few-Shot**: Se incluyen ejemplos concretos de clasificación para guiar al modelo

5. **Reducción de Temperatura**: `temperature=0.1` para respuestas consistentes y determinísticas

6. **Response Format JSON**: En Groq se usa `response_format={"type": "json_object"}` para garantizar JSON válido

### Prompt Utilizado

```
Eres un sistema experto de clasificación de tickets de soporte técnico.

Analiza el siguiente ticket y clasifícalo en dos dimensiones:

CATEGORÍA (elige una):
- Técnico: problemas de software, bugs, errores, rendimiento, funcionalidad
- Facturación: pagos, cobros, facturas, suscripciones, reembolsos
- Comercial: consultas de ventas, precios, planes, información general

SENTIMIENTO (elige uno):
- Positivo: satisfacción, agradecimiento, feedback positivo
- Neutral: consultas informativas sin carga emocional
- Negativo: frustración, quejas, urgencia, problemas críticos

Responde ÚNICAMENTE con un JSON válido en este formato:
{"category": "...", "sentiment": "..."}

No agregues explicaciones ni texto adicional.
```

### Por qué funciona

- **Contexto claro**: El modelo entiende su rol específico
- **Ejemplos concretos**: Los ejemplos de cada categoría ayudan a la clasificación precisa
- **Formato forzado**: Al especificar JSON, se evitan respuestas ambiguas
- **Temperatura baja**: Garantiza consistencia en las respuestas

## Tecnologías Utilizadas

### Backend

- **FastAPI** - Framework web Python
- **Groq** - API de IA (Llama 3.3 70B)
- **Supabase** - Base de datos PostgreSQL con Realtime
- **Python 3.11+**

### Frontend

- **React 18** - Librería UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool
- **Tailwind CSS** - Estilos
- **Supabase JS Client** - Integración con DB

### Automatización

- **n8n** - Workflow automation
- **Gmail API** - Notificaciones por email

## 📁 Estructura del Proyecto

```
├── BackendApi/
│   ├── main.py              # API FastAPI
│   ├── ai_service.py        # Servicio de IA
│   ├── requirements.txt     # Dependencias Python
│   └── .env                 # Variables de entorno
├── frontend/
│   ├── src/
│   │   ├── App.tsx          # Componente principal
│   │   ├── hooks/
│   │   │   └── useTickets.ts # Custom hook
│   │   └── supabaseClient.ts
│   └── package.json
├── Supabase/
│   └── setup.sql            # Schema de la base de datos
├── n8n-workflow/
│   └── workflow.json        # Flujo de automatización
└── README.md
```

## Instalación Local

### Backend

```bash
cd BackendApi
pip install -r requirements.txt
uvicorn main:app --reload
```

Variables de entorno necesarias (.env):

```
GROQ_API_KEY=groq_api_key
SUPABASE_URL=supabase_url
SUPABASE_SERVICE_ROLE_KEY=service_role_key
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Variables de entorno necesarias (.env):

```
VITE_SUPABASE_URL=supabase_url
VITE_SUPABASE_ANON_KEY=anon_key
```

### Base de Datos

Ejecuta el archivo `supabase/setup.sql` en el SQL Editor de Supabase.

## Funcionalidades

- ✅ Creación de tickets vía webhook
- ✅ Análisis automático con IA (categoría + sentimiento)
- ✅ Dashboard en tiempo real con Supabase Realtime
- ✅ Notificaciones por email para tickets negativos
- ✅ Logging de todas las notificaciones
- ✅ Estadísticas en tiempo real

## Autor

Owen Meléndez González  
Prueba Técnica - Full-Stack AI Engineer.
