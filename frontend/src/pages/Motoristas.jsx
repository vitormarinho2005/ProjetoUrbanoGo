import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

export default function Motoristas() {
  const [motoristas, setMotoristas] = useState([]);
  const [nome, setNome] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchMotoristas = () => {
    fetch("http://localhost:3000/motoristas")
      .then(res => res.json())
      .then(data => setMotoristas(data));
  };

  useEffect(() => fetchMotoristas(), []);

  const adicionarOuEditar = () => {
    if (!nome.trim()) {
      toast.error("O nome do motorista é obrigatório!");
      return;
    }

    if (editId) {
      // Editar
      fetch(`http://localhost:3000/motoristas/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome })
      })
        .then(() => { setNome(""); setEditId(null); fetchMotoristas(); toast.success("Motorista atualizado!"); });
    } else {
      // Adicionar
      fetch("http://localhost:3000/motoristas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome })
      })
        .then(() => { setNome(""); fetchMotoristas(); toast.success("Motorista adicionado!"); });
    }
  };

  const deletarMotorista = (id) => {
    if (window.confirm("Deseja realmente excluir este motorista?")) {
      fetch(`http://localhost:3000/motoristas/${id}`, { method: "DELETE" })
        .then(() => { fetchMotoristas(); toast.info("Motorista removido!"); });
    }
  };

  const editarMotorista = (m) => {
    setNome(m.nome);
    setEditId(m.id);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Motoristas</h2>

      {/* Formulário */}
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          value={nome}
          onChange={e => setNome(e.target.value)}
          placeholder="Nome do motorista"
          className="border px-2 py-1 rounded flex-1"
        />
        <button
          onClick={adicionarOuEditar}
          className="bg-blue-600 text-white px-4 py-1 rounded"
        >
          {editId ? "Atualizar" : "Adicionar"}
        </button>
        {editId && <button onClick={() => { setNome(""); setEditId(null); }} className="bg-gray-400 text-white px-4 py-1 rounded">Cancelar</button>}
      </div>

      {/* Lista de motoristas */}
      <ul className="border rounded overflow-hidden">
        {motoristas.map(m => (
          <li key={m.id} className="flex justify-between items-center px-4 py-2 border-b last:border-b-0 hover:bg-gray-50">
            <span>{m.nome}</span>
            <div className="flex gap-2">
              <button onClick={() => editarMotorista(m)} className="text-yellow-600 hover:text-yellow-800">
                <FaEdit />
              </button>
              <button onClick={() => deletarMotorista(m.id)} className="text-red-600 hover:text-red-800">
                <FaTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
