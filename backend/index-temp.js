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

// PERFIL - GET
app.get('/perfil/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [user] = await db.query('SELECT id, nome, email, is_admin FROM usuarios WHERE id = ?', [id]);
        if (user.length > 0) {
            res.json(user[0]);
        } else {
            res.status(404).json({ error: 'Usuário não encontrado' });
        }
    } catch (e) { res.status(500).json({error: e.message}) }
});

// PERFIL - PUT
app.put('/perfil/:id', async (req, res) => {
    const { id } = req.params;
    const { nome } = req.body;
    try {
        if (!nome) return res.status(400).json({error: 'Nome é obrigatório'});
        
        await db.query('UPDATE usuarios SET nome = ? WHERE id = ?', [nome, id]);
        res.json({ message: 'Perfil atualizado com sucesso!' });
    } catch (e) { res.status(500).json({ error: e.message }) }
});

// LISTAR QUARTOS COM DISPONIBILIDADE POR DATA
app.get('/quartos', async (req, res) => {
    const { data } = req.query;
    try {
        const [quartos] = await db.query('SELECT * FROM quartos ORDER BY preco ASC');
        
        if (data) {
            // Se passou uma data, verifica disponibilidade para essa data
            const [reservas] = await db.query('SELECT quarto_id FROM reservas WHERE data_reserva = ?', [data]);
            const quartosReservados = reservas.map(r => r.quarto_id);
            
            const quartosComDisponibilidade = quartos.map(q => ({
                ...q,
                disponivel: !quartosReservados.includes(q.id)
            }));
            
            res.json(quartosComDisponibilidade);
        } else {
            // Se não passou data, retorna todos com disponível = true
            res.json(quartos.map(q => ({ ...q, disponivel: true })));
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// LISTAR COMODIDADES DE UM QUARTO
app.get('/quartos/:quarto_id/comodidades', async (req, res) => {
    const { quarto_id } = req.params;
    try {
        const [comodidades] = await db.query(`
            SELECT c.id, c.nome, c.icone, c.descricao
            FROM comodidades c
            JOIN quarto_comodidade qc ON c.id = qc.comodidade_id
            WHERE qc.quarto_id = ?
            ORDER BY c.nome ASC
        `, [quarto_id]);
        res.json(comodidades);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// RESERVAR QUARTO EM UMA DATA ESPECÍFICA
app.post('/reservar', async (req, res) => {
    const { usuario_id, quarto_id, data_reserva } = req.body;
    try {
        // Verifica se já existe reserva para esse quarto nessa data
        const [existe] = await db.query('SELECT id FROM reservas WHERE quarto_id = ? AND data_reserva = ?', [quarto_id, data_reserva]);
        
        if (existe.length > 0) {
            return res.status(400).json({ error: 'Este quarto já está reservado para essa data' });
        }
        
        await db.query('INSERT INTO reservas (usuario_id, quarto_id, data_reserva) VALUES (?, ?, ?)', [usuario_id, quarto_id, data_reserva]);
        res.json({ message: 'Reserva realizada com sucesso!' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ADMIN - LISTAR TODAS AS RESERVAS
app.get('/admin/reservas', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT r.id, u.nome as usuario, q.nome as quarto, r.data_reserva, r.created_at 
            FROM reservas r 
            JOIN usuarios u ON r.usuario_id = u.id 
            JOIN quartos q ON r.quarto_id = q.id 
            ORDER BY r.data_reserva DESC
        `);
        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ADMIN - CANCELAR RESERVA
app.delete('/admin/reservas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [reserva] = await db.query('SELECT id FROM reservas WHERE id = ?', [id]);
        if(reserva.length > 0) {
            await db.query('DELETE FROM reservas WHERE id = ?', [id]);
            res.json({ message: 'Reserva cancelada' });
        } else {
            res.status(404).json({ error: 'Reserva não encontrada' });
        }
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

// LISTAR RESERVAS DO CLIENTE
app.get('/minhas-reservas/:usuario_id', async (req, res) => {
    const { usuario_id } = req.params;
    try {
        const [rows] = await db.query(`
            SELECT r.id, q.nome, q.preco, r.data_reserva, r.created_at 
            FROM reservas r 
            JOIN quartos q ON r.quarto_id = q.id 
            WHERE r.usuario_id = ? 
            ORDER BY r.data_reserva DESC
        `, [usuario_id]);
        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// CANCELAR RESERVA (Cliente)
app.delete('/reservas/:id/:usuario_id', async (req, res) => {
    const { id, usuario_id } = req.params;
    try {
        const [reserva] = await db.query('SELECT usuario_id FROM reservas WHERE id = ?', [id]);
        if(reserva.length > 0 && reserva[0].usuario_id == usuario_id) {
            await db.query('DELETE FROM reservas WHERE id = ?', [id]);
            res.json({ message: 'Reserva cancelada com sucesso!' });
        } else {
            res.status(403).json({ error: 'Não autorizado' });
        }
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(3000, () => console.log('Servidor ON'));
