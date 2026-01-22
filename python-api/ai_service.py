import os
import json
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

SYSTEM_PROMPT = """Eres un sistema experto de clasificación de tickets de soporte técnico.

Analiza el siguiente ticket y clasifícalo en dos dimensiones:

CATEGORÍA (elige una):
- Tecnico: problemas de software, bugs, errores, rendimiento, funcionalidad
- Facturación: pagos, cobros, facturas, suscripciones, reembolsos  
- Comercial: consultas de ventas, precios, planes, información general

SENTIMIENTO (elige uno):
- Positivo: satisfacción, agradecimiento, feedback positivo
- Neutral: consultas informativas sin carga emocional
- Negativo: frustración, quejas, urgencia, problemas críticos

Responde ÚNICAMENTE con un JSON válido en este formato:
{"category": "...", "sentiment": "..."}

No agregues explicaciones ni texto adicional."""

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def analyze_ticket(text: str) -> dict:
    """
    Analiza un ticket usando Llama 3.3 vía Groq
    """
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": f"Analiza este ticket: {text}"
            }
        ],
        model="llama-3.3-70b-versatile",
        temperature=0.1,
        max_tokens=150,
        response_format={"type": "json_object"}
    )

    response_text = chat_completion.choices[0].message.content
    result = json.loads(response_text)

    if "category" not in result or "sentiment" not in result:
        raise ValueError("Respuesta incompleta del modelo")

    return {
        "category": normalize_category(result["category"]),
        "sentiment": normalize_sentiment(result["sentiment"])
    }


def normalize_category(category: str) -> str:
    """Normaliza la categoría a valores válidos"""
    category_lower = category.lower()

    if "técnico" in category_lower or "tecnico" in category_lower or "technical" in category_lower or "tech" in category_lower:
        return "Técnico"
    elif "facturación" in category_lower or "facturacion" in category_lower or "billing" in category_lower:
        return "Facturación"
    else:
        return "Comercial"


def normalize_sentiment(sentiment: str) -> str:
    """Normaliza el sentimiento a valores válidos"""
    sentiment_lower = sentiment.lower()

    if "positivo" in sentiment_lower or "positive" in sentiment_lower:
        return "Positivo"
    elif "negativo" in sentiment_lower or "negative" in sentiment_lower:
        return "Negativo"
    else:
        return "Neutral"
