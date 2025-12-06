// server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: '127.0.0.1', // Mudei de 'localhost' para o IP direto
    user: 'root',
    password: '',      // <--- VERIFIQUE O PASSO 3 ABAIXO
    database: 'hotel_db'
});

// Rota de Cadastro
app.post('/cadastro', (req, res) => {
    const { nome, email, senha } = req.body;
    const sql = "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)";
    db.query(sql, [nome, email, senha], (err, result) => {
        if (err) return res.send({ erro: "Erro ao cadastrar ou email já existe." });
        res.send({ msg: "Cadastrado com sucesso!" });
    });
});

// Rota de Login
app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    const sql = "SELECT * FROM usuarios WHERE email = ? AND senha = ?";
    db.query(sql, [email, senha], (err, result) => {
        if (err) return res.send({ erro: "Erro no servidor" });
        if (result.length > 0) {
            // Retorna dados do usuário (incluindo se é admin)
            res.send({ msg: "Logado", user: result[0] });
        } else {
            res.send({ erro: "Email ou senha incorretos" });
        }
    });
});

// Listar Quartos (Para Clientes)
app.get('/quartos', (req, res) => {
    db.query("SELECT * FROM quartos", (err, result) => {
        if (err) res.send({ erro: err });
        res.send(result);
    });
});

// Reservar Quarto (Cliente)
app.post('/reservar', (req, res) => {
    const { usuario_id, quarto_id } = req.body;
    
    // 1. Cria a reserva
    const sqlReserva = "INSERT INTO reservas (usuario_id, quarto_id) VALUES (?, ?)";
    db.query(sqlReserva, [usuario_id, quarto_id], (err, result) => {
        if (err) return res.send({ erro: "Erro ao reservar" });

        // 2. Marca quarto como indisponível
        db.query("UPDATE quartos SET disponivel = FALSE WHERE id = ?", [quarto_id], () => {
             res.send({ msg: "Reserva realizada com sucesso!" });
        });
    });
});

// Listar Reservas (Para Admin)
app.get('/reservas', (req, res) => {
    // Traz dados da reserva + nome do cliente + nome do quarto
    const sql = `
        SELECT r.id, u.nome as cliente, q.nome as quarto, q.id as quarto_id 
        FROM reservas r
        JOIN usuarios u ON r.usuario_id = u.id
        JOIN quartos q ON r.quarto_id = q.id
    `;
    db.query(sql, (err, result) => {
        if (err) res.send({ erro: err });
        res.send(result);
    });
});

// Cancelar Reserva (Admin)
app.post('/cancelar', (req, res) => {
    const { id_reserva, id_quarto } = req.body;

    // 1. Deleta a reserva
    db.query("DELETE FROM reservas WHERE id = ?", [id_reserva], (err) => {
        if (err) return res.send({ erro: "Erro ao cancelar" });

        // 2. Libera o quarto novamente
        db.query("UPDATE quartos SET disponivel = TRUE WHERE id = ?", [id_quarto], () => {
            res.send({ msg: "Reserva cancelada e quarto liberado." });
        });
    });
});

app.listen(3001, () => {
    console.log("Servidor rodando na porta 3001");
});