module.exports = (corridas, motoristas) => {
    const express = require("express");
    const router = express.Router();

    // GET - Listar corridas
    router.get("/", (req, res) => {
        res.json(corridas);
    });

    // POST - Criar corrida
    router.post("/", (req, res) => {
        const { passageiro_id, motorista_id, origem, destino, distancia_km } = req.body;

        const motorista = motoristas.find(m => m.id === motorista_id);
        if (!motorista || !motorista.disponibilidade) {
            return res.status(400).json({ erro: "Motorista indisponível" });
        }

        const tarifa = motorista.veiculo.tarifaBase + (distancia_km * 2.5);
        const nova = {
            id: corridas.length + 1,
            passageiro_id,
            motorista_id,
            origem,
            destino,
            distancia_km,
            tarifa_calculada: tarifa,
            status: "pendente",
            dataHora: new Date()
        };

        corridas.push(nova);
        motorista.disponibilidade = false;

        res.status(201).json(nova);
    });

    // PUT - Finalizar corrida
    router.put("/:id", (req, res) => {
        const corrida = corridas.find(c => c.id == req.params.id);
        if (!corrida) return res.status(404).json({ erro: "Não encontrada" });

        corrida.status = "concluída";
        const motorista = motoristas.find(m => m.id === corrida.motorista_id);
        motorista.disponibilidade = true;

        res.json(corrida);
    });

    // DELETE - Cancelar corrida
    router.delete("/:id", (req, res) => {
        const index = corridas.findIndex(c => c.id == req.params.id);
        if (index === -1) return res.status(404).json({ erro: "Não encontrada" });

        corridas.splice(index, 1);
        res.status(204).send();
    });

    return router;
};
