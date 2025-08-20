import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

export default function Passageiros() {
  const [passageiros, setPassageiros] = useState([]);
  const [nome, setNome] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchPassageiros = () => {
    fetch("http://localhost:3000/passageiros")
      .then(res => res.json())
      .then(data => setPassageiros(data));
  };

  useEffect(() => fetchPassageiros(), []);

  const adicionarOuEditar = () => {
    if (!nome.trim()) {
      toast.error("O nome do passageiro é obrigatório!");
      return;
    }

    if (editId) {
      fetch(`http://localhost:3000/passageiros/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome })
      })
        .then(() => { setNome(""); setEditId(null); fetchPassageiros(); toast.success("Passageiro atualizado!"); });
    } else {
      fetch("http://localhost:3000/passageiros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome })
      })
        .then(() => { setNome(""); fetchPassageiros(); toast.success("Passageiro adicionado!"); });
    }
  };

  const deletarPassageiro = (id) => {
    if (window.confirm("Deseja realmente excluir este passageiro?")) {
      fetch(`http://localhost:3000/passageiros/${id}`, { method: "DELETE" })
        .then(() => { fetchPassageiros(); toast.info("Passageiro removido!"); });
    }
  };

  const editarPassageiro = (p) => {
    setNome(p.nome);
    setEditId(p.id);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Passageiros</h2>

      {/* Formulário */}
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          value={nome}
          onChange={e => setNome(e.target.value)}
          placeholder="Nome do passageiro"
          className="border px-2 py-1 rounded flex-1"
        />
        <button onClick={adicionarOuEditar} className="bg-green-600 text-white px-4 py-1 rounded">
          {editId ? "Atualizar" : "Adicionar"}
        </button>
        {editId && <button onClick={() => { setNome(""); setEditId(null); }} className="bg-gray-400 text-white px-4 py-1 rounded">Cancelar</button>}
      </div>

      {/* Lista de passageiros */}
      <ul className="border rounded overflow-hidden">
        {passageiros.map(p => (
          <li key={p.id} className="flex justify-between items-center px-4 py-2 border-b last:border-b-0 hover:bg-gray-50">
            <span>{p.nome}</span>
            <div className="flex gap-2">
              <button onClick={() => editarPassageiro(p)} className="text-yellow-600 hover:text-yellow-800">
                <FaEdit />
              </button>
              <button onClick={() => deletarPassageiro(p.id)} className="text-red-600 hover:text-red-800">
                <FaTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
