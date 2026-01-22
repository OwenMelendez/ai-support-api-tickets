import { useState } from "react";
import type { Ticket } from "./types/ticket";
import { useTickets } from "./hooks/useTickets";
import "./App.css";

function App() {
  const { tickets, loading } = useTickets();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const getSentimentColor = (sentiment: string | null) => {
    switch (sentiment) {
      case "Positivo":
        return "bg-green-100 text-green-800 border-green-300";
      case "Negativo":
        return "bg-red-100 text-red-800 border-red-300";
      case "Neutral":
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-gray-50 text-gray-500 border-gray-200";
    }
  };

  const getCategoryColor = (category: string | null) => {
    switch (category) {
      case "Técnico":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Facturación":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "Comercial":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-gray-50 text-gray-500 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-2">AI Support Dashboard</h1>
          <p className="text-gray-400">
            Sistema de tickets con análisis de IA en tiempo real
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-gray-800 rounded-xl shadow p-6 text-center">
            <div className="text-sm text-gray-400 mb-1">Total Tickets</div>
            <div className="text-3xl font-bold text-white">
              {tickets.length}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow p-6 text-center">
            <div className="text-sm text-gray-400 mb-1">Procesados</div>
            <div className="text-3xl font-bold text-green-400">
              {tickets.filter((t: Ticket) => t.processed).length}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow p-6 text-center">
            <div className="text-sm text-gray-400 mb-1">Negativos</div>
            <div className="text-3xl font-bold text-red-400">
              {tickets.filter((t: Ticket) => t.sentiment === "Negativo").length}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow p-6 text-center">
            <div className="text-sm text-gray-400 mb-1">Pendientes</div>
            <div className="text-3xl font-bold text-orange-400">
              {tickets.filter((t: Ticket) => !t.processed).length}
            </div>
          </div>
        </div>

        {/* Tickets */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-300 mx-auto"></div>
            <p className="mt-4 text-gray-400">Cargando tickets...</p>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-center">Tickets</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {tickets.map((ticket: Ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className="
                    bg-gray-800 rounded-xl p-6 cursor-pointer
                    shadow-md
                    transition-all duration-300 ease-out
                    hover:-translate-y-2
                    hover:shadow-2xl
                    hover:ring-1 hover:ring-white/10
                  "
                >
                  <div className="flex justify-between mb-3">
                    <span className="text-xs text-gray-500 font-mono">
                      {ticket.id.slice(0, 8)}...
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(ticket.created_at).toLocaleDateString("es-ES")}
                    </span>
                  </div>

                  <p className="text-gray-200 mb-4 line-clamp-3">
                    {ticket.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(
                        ticket.category,
                      )}`}
                    >
                      {ticket.category || "Sin categoría"}
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getSentimentColor(
                        ticket.sentiment,
                      )}`}
                    >
                      {ticket.sentiment || "Sin analizar"}
                    </span>

                    {ticket.processed && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-900 text-green-300 border border-green-700">
                        ✓ Procesado
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 relative">
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>

            <h3 className="text-xl font-semibold mb-4">Detalle del Ticket</h3>

            <div className="space-y-3 text-sm">
              <p className="text-gray-400">
                <span className="font-medium text-gray-200">ID:</span>{" "}
                {selectedTicket.id}
              </p>

              <p className="text-gray-400">
                <span className="font-medium text-gray-200">Fecha:</span>{" "}
                {new Date(selectedTicket.created_at).toLocaleString("es-ES")}
              </p>

              <p className="text-gray-200">{selectedTicket.description}</p>

              <div className="flex flex-wrap gap-2 pt-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(
                    selectedTicket.category,
                  )}`}
                >
                  {selectedTicket.category || "Sin categoría"}
                </span>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getSentimentColor(
                    selectedTicket.sentiment,
                  )}`}
                >
                  {selectedTicket.sentiment || "Sin analizar"}
                </span>

                {selectedTicket.processed && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-900 text-green-300 border border-green-700">
                    ✓ Procesado
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
