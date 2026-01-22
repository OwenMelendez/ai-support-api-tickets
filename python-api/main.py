from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from supabase import create_client
from dotenv import load_dotenv
import os
from ai_service import analyze_ticket

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("Missing Supabase credentials")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI(title="AI Support Ticket API")


class TicketProcessRequest(BaseModel):
    ticket_id: str


@app.post("/process-ticket")
def process_ticket(payload: TicketProcessRequest):
    try:
        # 1. Obtener el ticket de Supabase
        ticket_result = (
            supabase
            .table("tickets")
            .select("*")
            .eq("id", payload.ticket_id)
            .single()
            .execute()
        )

        if not ticket_result.data:
            raise HTTPException(status_code=404, detail="Ticket no encontrado")

        ticket = ticket_result.data
        description = ticket.get("description", "")

        if not description:
            raise HTTPException(
                status_code=400, detail="El ticket no tiene descripción")

        # 2. Analizar con IA
        analysis = analyze_ticket(description)

        # 3. Actualizar el ticket en Supabase con los resultados del análisis
        update_result = (
            supabase
            .table("tickets")
            .update({
                "category": analysis["category"],
                "sentiment": analysis["sentiment"],
                "processed": True
            })
            .eq("id", payload.ticket_id)
            .execute()
        )

        return {
            "message": "Ticket processed successfully",
            "ticket_id": payload.ticket_id,
            "category": analysis["category"],
            "sentiment": analysis["sentiment"]
        }

    except ValueError as e:
        raise HTTPException(status_code=500, detail=f"Error de IA: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
