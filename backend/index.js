const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db'); 

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- ROTA DE LOGIN CORRIGIDA ---
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const [users] = await db.query('SELECT * FROM usuarios WHERE email = ? AND senha = ?', [email, senha]);
        
        if (users.length > 0) {
            const user = users[0];
            
            // LOG PARA DEBUG (Olhe no seu terminal do backend quando logar!)
            console.log('Login realizado:', user.email, '| Admin no Banco:', user.is_admin);

            // Força a verificação: se for 1 ou true, vira true.
            const isAdmin = (user.is_admin === 1 || user.is_admin === true);

            res.json({ 
                auth: true, 
                user: { 
                    id: user.id, 
                    nome: user.nome, 
                    email: user.email, 
                    isAdmin: isAdmin // Envia um booleano CLARO para o frontend
                } 
            });
        } else {
            res.status(401).json({ auth: false, message: 'Email ou senha incorretos!' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// CADASTRO
app.post('/cadastro', async (req, res) => {
    const { nome, email, senha } = req.body;
    try {
        await db.query('INSERT INTO usuarios (nome, email, senha, is_admin) VALUES (?, ?, ?, ?)', [nome, email, senha, false]);
        res.json({ message: 'OK' });
    } catch (e) { res.status(500).json({error: e.message}) }
});

// LISTAR QUARTOS
app.get('/quartos', async (req, res) => {
    const [rows] = await db.query('SELECT * FROM quartos');
    res.json(rows);
});

// RESERVAR
app.post('/reservar', async (req, res) => {
    const { usuario_id, quarto_id } = req.body;
    await db.query('INSERT INTO reservas (usuario_id, quarto_id) VALUES (?, ?)', [usuario_id, quarto_id]);
    await db.query('UPDATE quartos SET disponivel = FALSE WHERE id = ?', [quarto_id]);
    res.json({ message: 'OK' });
});

// ADMIN
app.get('/admin/reservas', async (req, res) => {
    const [rows] = await db.query(`SELECT r.id, u.nome as usuario, q.nome as quarto FROM reservas r JOIN usuarios u ON r.usuario_id = u.id JOIN quartos q ON r.quarto_id = q.id`);
    res.json(rows);
});

app.delete('/admin/reservas/:id', async (req, res) => {
    const { id } = req.params;
    const [reserva] = await db.query('SELECT quarto_id FROM reservas WHERE id = ?', [id]);
    if(reserva.length > 0) {
        await db.query('DELETE FROM reservas WHERE id = ?', [id]);
        await db.query('UPDATE quartos SET disponivel = TRUE WHERE id = ?', [reserva[0].quarto_id]);
    }
    res.json({ message: 'OK' });
});

app.listen(3000, () => console.log('Servidor ON'));
