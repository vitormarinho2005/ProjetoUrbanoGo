import { useState } from "react";

export default function FormNovaCorrida({ atualizarCorridas }) {
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [distancia, setDistancia] = useState("");
  const [motorista, setMotorista] = useState("");
  const [passageiro, setPassageiro] = useState("");

  const enviarCorrida = () => {
    if (!origem || !destino || !distancia || !motorista || !passageiro) return;
    const tarifa_calculada = Number(distancia) * 3; // regra de negócio
    const novaCorrida = { origem, destino, distancia_km: Number(distancia), tarifa_calculada, status: "em andamento", motorista, passageiro, dataHora: new Date() };
    fetch("http://localhost:3000/corridas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novaCorrida)
    }).then(res => res.json())
      .then(c => { atualizarCorridas(c); setOrigem(""); setDestino(""); setDistancia(""); setMotorista(""); setPassageiro(""); });
  };

  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2">Nova Corrida</h3>
      <div className="flex flex-wrap gap-2">
        <input value={origem} onChange={e => setOrigem(e.target.value)} placeholder="Origem" className="border px-2 py-1 rounded"/>
        <input value={destino} onChange={e => setDestino(e.target.value)} placeholder="Destino" className="border px-2 py-1 rounded"/>
        <input value={distancia} onChange={e => setDistancia(e.target.value)} placeholder="Distância (km)" type="number" className="border px-2 py-1 rounded"/>
        <input value={motorista} onChange={e => setMotorista(e.target.value)} placeholder="Motorista" className="border px-2 py-1 rounded"/>
        <input value={passageiro} onChange={e => setPassageiro(e.target.value)} placeholder="Passageiro" className="border px-2 py-1 rounded"/>
        <button onClick={enviarCorrida} className="bg-purple-600 text-white px-4 py-1 rounded">Adicionar Corrida</button>
      </div>
    </div>
  );
}
