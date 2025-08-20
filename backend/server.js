const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Memória (poderia ser PostgreSQL)
let corridas = [];
let motoristas = [];
let passageiros = [];
let veiculos = [];

// Importar rotas
const corridasRouter = require("./routes/corridas")(corridas, motoristas);
app.use("/corridas", corridasRouter);

// Exemplo: listar motoristas
app.get("/motoristas", (req, res) => {
  res.json(motoristas);
});

// Exemplo: adicionar motorista
app.post("/motoristas", (req, res) => {
  const { nome, cnh, veiculo } = req.body;
  const novo = { id: motoristas.length + 1, nome, cnh, veiculo, disponibilidade: true };
  motoristas.push(novo);
  res.status(201).json(novo);
});

app.listen(3000, () => console.log("🚀 API rodando na porta 3000"));
