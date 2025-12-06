const mysql = require('mysql2');

// Crie a conexão com os dados do seu banco
const pool = mysql.createPool({
  host: 'localhost',            // O endereço do banco (geralmente localhost)
  user: 'root',                 // Seu usuário do MySQL (padrão costuma ser 'root')
  database: 'hotel_db',    // <--- TROQUE PELO NOME DO SEU BANCO DE DADOS
  password: '',        // <--- TROQUE PELA SUA SENHA DO MYSQL
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Exporta a conexão para usar no resto do projeto (usando promises para facilitar)
module.exports = pool.promise();