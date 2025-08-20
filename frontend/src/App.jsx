import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import Motoristas from "./pages/Motoristas";
import Passageiros from "./pages/Passageiros";
import Corridas from "./pages/Corridas";
import { FaCar, FaUser, FaList } from "react-icons/fa";

export default function App() {
  const [pagina, setPagina] = useState("corridas");

  const renderPagina = () => {
    switch (pagina) {
      case "motoristas":
        return <Motoristas />;
      case "passageiros":
        return <Passageiros />;
      case "corridas":
      default:
        return <Corridas />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-purple-600 text-white p-6 shadow-md">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FaCar /> UrbanoGo - Mobilidade Urbana
        </h1>
      </header>

      <main className="p-6 max-w-6xl mx-auto">
        {/* Navegação */}
        <nav className="flex space-x-4 mb-6">
          <button
            onClick={() => setPagina("corridas")}
            className={`flex items-center gap-1 px-4 py-2 rounded ${pagina === "corridas" ? "bg-purple-600 text-white" : "bg-gray-200"}`}
          >
            <FaList /> Corridas
          </button>
          <button
            onClick={() => setPagina("motoristas")}
            className={`flex items-center gap-1 px-4 py-2 rounded ${pagina === "motoristas" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            <FaUser /> Motoristas
          </button>
          <button
            onClick={() => setPagina("passageiros")}
            className={`flex items-center gap-1 px-4 py-2 rounded ${pagina === "passageiros" ? "bg-green-600 text-white" : "bg-gray-200"}`}
          >
            <FaUser /> Passageiros
          </button>
        </nav>

        {/* Conteúdo da página */}
        <div className="bg-white p-6 rounded-lg shadow">{renderPagina()}</div>
      </main>

      {/* Toasts */}
      <ToastContainer position="top-right" autoClose={5000} newestOnTop />
    </div>
  );
}
