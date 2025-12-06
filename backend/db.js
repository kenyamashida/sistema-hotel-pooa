const mysql = require('mysql2');

// Crie a conexão com os dados do seu banco
const pool = mysql.createPool({
  host: 'localhost',            // O endereço do banco (geralmente localhost)
  user: 'root',                 // Seu usuário do MySQL (padrão costuma ser 'root')
  database: 'hotel_db',    // <--- TROQUE PELO NOME DO SEU BANCO DE DADOS
<<<<<<< HEAD
  password: 'Biel!67*',        // <--- TROQUE PELA SUA SENHA DO MYSQL
=======
  password: '',        // <--- TROQUE PELA SUA SENHA DO MYSQL
>>>>>>> d9e2514a2ca3b1106bb09e0c24f1a6a1728bb9cf
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

<<<<<<< HEAD
// Usamos a versão promise para facilitar async/await
const promisePool = pool.promise();

// Inicializa tabelas necessárias (executa ao iniciar o backend)
async function initTables() {
  try {
    // Usuários
    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        senha VARCHAR(255) NOT NULL,
        is_admin TINYINT(1) DEFAULT 0
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Quartos
    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS quartos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        preco Decimal(10,2) NOT NULL,
        descricao TEXT,
        is_desconto TINYINT(1) DEFAULT 0
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Comodidades
    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS comodidades (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL UNIQUE,
        icone VARCHAR(50),
        descricao TEXT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Associação entre Quartos e Comodidades (muitos para muitos)
    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS quarto_comodidade (
        id INT AUTO_INCREMENT PRIMARY KEY,
        quarto_id INT NOT NULL,
        comodidade_id INT NOT NULL,
        FOREIGN KEY (quarto_id) REFERENCES quartos(id) ON DELETE CASCADE,
        FOREIGN KEY (comodidade_id) REFERENCES comodidades(id) ON DELETE CASCADE,
        UNIQUE KEY unique_quarto_comodidade (quarto_id, comodidade_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Reservas
    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS reservas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL,
        quarto_id INT NOT NULL,
        data_reserva DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        FOREIGN KEY (quarto_id) REFERENCES quartos(id) ON DELETE CASCADE,
        UNIQUE KEY unique_reserva (quarto_id, data_reserva)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    console.log('Tabelas verificadas/criadas: usuarios, quartos, comodidades, quarto_comodidade, reservas');
  } catch (err) {
    console.error('Erro ao criar/verificar tabelas:', err.message || err);
  }
}

// Inicia a criação/checagem das tabelas (não bloqueia a exportação)
initTables();

// Exporta a conexão para usar no resto do projeto
module.exports = promisePool;
=======
// Exporta a conexão para usar no resto do projeto (usando promises para facilitar)
module.exports = pool.promise();
>>>>>>> d9e2514a2ca3b1106bb09e0c24f1a6a1728bb9cf
