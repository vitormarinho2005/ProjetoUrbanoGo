import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FormNovaCorrida from "../components/FormNovaCorrida";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { FaExclamationTriangle, FaCheckCircle, FaClock, FaSort } from "react-icons/fa";

export default function Corridas() {
  const [corridas, setCorridas] = useState([]);
  const [alertasExibidos, setAlertasExibidos] = useState(new Set());

  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroMotorista, setFiltroMotorista] = useState("");
  const [filtroPassageiro, setFiltroPassageiro] = useState("");
  const [ordenarPor, setOrdenarPor] = useState(""); // 'tarifa' ou 'distancia'
  const [ordemAsc, setOrdemAsc] = useState(true);

  const fetchCorridas = () => {
    fetch("http://localhost:3000/corridas")
      .then(res => res.json())
      .then(data => setCorridas(data));
  };

  useEffect(() => {
    fetchCorridas();
    const interval = setInterval(fetchCorridas, 60000);
    return () => clearInterval(interval);
  }, []);

  const atualizarCorridas = (nova) => {
    setCorridas([...corridas, nova]);
  };

  const verificarAtraso = (corrida) => {
    if (corrida.status !== "em andamento") return false;
    const inicio = new Date(corrida.dataHora);
    return (new Date() - inicio) / 60000 > 30;
  };

  // Toast para atrasos
  useEffect(() => {
    corridas.forEach(c => {
      const atrasada = verificarAtraso(c);
      if (atrasada && !alertasExibidos.has(c.id)) {
        toast.error(`⚠️ Corrida ${c.id} está atrasada!`);
        setAlertasExibidos(prev => new Set(prev).add(c.id));
      }
    });
  }, [corridas]);

  const totalConcluidas = corridas.filter(c => c.status === "concluída").length;
  const totalAndamento = corridas.filter(c => c.status === "em andamento").length;
  const totalAtrasadas = corridas.filter(verificarAtraso).length;

  const dadosGrafico = [
    { name: "Concluídas", qtd: totalConcluidas },
    { name: "Em andamento", qtd: totalAndamento },
    { name: "Atrasadas", qtd: totalAtrasadas },
  ];

  // Aplicar filtros
  let corridasFiltradas = corridas.filter(c => {
    const atrasada = verificarAtraso(c);
    if (filtroStatus === "concluída" && c.status !== "concluída") return false;
    if (filtroStatus === "andamento" && c.status !== "em andamento") return false;
    if (filtroStatus === "atrasada" && !atrasada) return false;
    if (filtroMotorista && !c.motorista.toLowerCase().includes(filtroMotorista.toLowerCase())) return false;
    if (filtroPassageiro && !c.passageiro.toLowerCase().includes(filtroPassageiro.toLowerCase())) return false;
    return true;
  });

  // Aplicar ordenação
  if (ordenarPor) {
    corridasFiltradas.sort((a, b) => {
      const valA = ordenarPor === "tarifa" ? a.tarifa_calculada : a.distancia_km;
      const valB = ordenarPor === "tarifa" ? b.tarifa_calculada : b.distancia_km;
      return ordemAsc ? valA - valB : valB - valA;
    });
  }

  const toggleOrdenar = (campo) => {
    if (ordenarPor === campo) setOrdemAsc(!ordemAsc);
    else { setOrdenarPor(campo); setOrdemAsc(true); }
  };

  return (
    <div>
      {/* Indicadores */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded">
          <FaCheckCircle /> Concluídas: {totalConcluidas}
        </div>
        <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded">
          <FaClock /> Em andamento: {totalAndamento}
        </div>
        <div className="flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded animate-pulse">
          <FaExclamationTriangle /> Atrasadas: {totalAtrasadas}
        </div>
      </div>

      {/* Gráfico */}
      <div className="mb-6 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dadosGrafico}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="qtd" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)} className="border px-2 py-1 rounded">
          <option value="todos">Todos os status</option>
          <option value="concluída">Concluídas</option>
          <option value="andamento">Em andamento</option>
          <option value="atrasada">Atrasadas</option>
        </select>
        <input value={filtroMotorista} onChange={e => setFiltroMotorista(e.target.value)} placeholder="Motorista" className="border px-2 py-1 rounded"/>
        <input value={filtroPassageiro} onChange={e => setFiltroPassageiro(e.target.value)} placeholder="Passageiro" className="border px-2 py-1 rounded"/>
      </div>

      {/* Formulário */}
      <FormNovaCorrida atualizarCorridas={atualizarCorridas} />

      {/* Tabela responsiva */}
      <div className="overflow-x-auto">
        <table className="w-full border text-left">
          <thead className="bg-gray-100">
            <tr>
              <th>ID</th>
              <th>Origem</th>
              <th>Destino</th>
              <th className="cursor-pointer" onClick={() => toggleOrdenar("distancia")}>
                Distância <FaSort className="inline"/>
              </th>
              <th className="cursor-pointer" onClick={() => toggleOrdenar("tarifa")}>
                Tarifa <FaSort className="inline"/>
              </th>
              <th>Motorista</th>
              <th>Passageiro</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {corridasFiltradas.map(c => {
              const atrasada = verificarAtraso(c);
              let corStatus = "text-gray-800";
              let linhaClasses = "border-b";
              if (c.status === "concluída") corStatus = "text-green-600";
              else if (c.status === "em andamento") {
                if (atrasada) { corStatus = "text-red-600 font-bold"; linhaClasses += " animate-pulse bg-red-50"; }
                else corStatus = "text-yellow-600";
              }
              return (
                <tr key={c.id} className={linhaClasses}>
                  <td>{c.id}</td>
                  <td>{c.origem}</td>
                  <td>{c.destino}</td>
                  <td>{c.distancia_km} km</td>
                  <td>R$ {c.tarifa_calculada}</td>
                  <td>{c.motorista}</td>
                  <td>{c.passageiro}</td>
                  <td className={corStatus}>{c.status} {atrasada && "⚠️ Atrasada"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
