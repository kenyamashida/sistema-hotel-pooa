<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manual do Sistema de Hotel</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #24292e;
            max-width: 900px;
            margin: 0 auto;
            padding: 40px 20px;
            background-color: #ffffff;
        }

        h1, h2, h3 {
            border-bottom: 1px solid #eaecef;
            padding-bottom: 0.3em;
            margin-top: 24px;
        }

        h1 { font-size: 2em; margin-bottom: 16px; border-bottom: none; }
        h2 { font-size: 1.5em; }
        h3 { font-size: 1.25em; }

        p { margin-bottom: 16px; }

        code {
            padding: 0.2em 0.4em;
            margin: 0;
            font-size: 85%;
            background-color: #f6f8fa;
            border-radius: 6px;
            font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
        }

        pre {
            padding: 16px;
            overflow: auto;
            font-size: 85%;
            line-height: 1.45;
            background-color: #f6f8fa;
            border-radius: 6px;
            margin-bottom: 16px;
        }

        pre code {
            padding: 0;
            background-color: transparent;
        }

        table {
            border-collapse: collapse;
            width: 100%;
            margin-bottom: 16px;
        }

        table th, table td {
            padding: 6px 13px;
            border: 1px solid #dfe2e5;
        }

        table tr:nth-child(2n) {
            background-color: #f6f8fa;
        }

        blockquote {
            padding: 0 1em;
            color: #6a737d;
            border-left: 0.25em solid #dfe2e5;
            margin: 0 0 16px 0;
        }

        .highlight-box {
            background-color: #e1f5fe;
            padding: 15px;
            border-radius: 8px;
            border-left: 5px solid #039be5;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>

    <h1>🏨 Sistema de Gerenciamento de Hotel</h1>

    <p>Projeto desenvolvido para a disciplina de <strong>Programação Orientada a Objetos (POO)</strong>. <br>
    Trata-se de um sistema Full Stack completo com Backend (Node/Express), Frontend (React/Vite) e Banco de Dados (MySQL).</p>

    <div class="highlight-box">
        <strong>Funcionalidades Principais:</strong>
        <ul>
            <li>Autenticação de Usuários (Login/Cadastro).</li>
            <li>Níveis de acesso distintos (Admin vs Cliente).</li>
            <li>Dashboard interativo com fotos dos quartos.</li>
            <li>Sistema de Reservas em tempo real.</li>
        </ul>
    </div>

    <h2>🚀 Como rodar o projeto</h2>
    <p>Este projeto está dividido em duas partes (servidor e site). Você precisará de dois terminais abertos simultaneamente.</p>

    <h3>1. Configurar o Banco de Dados</h3>
    <ol>
        <li>Abra o seu <strong>MySQL (XAMPP/Workbench)</strong>.</li>
        <li>Crie um banco de dados chamado <code>projeto_pooa</code> (ou o nome que estiver no arquivo <code>db.js</code>).</li>
        <li>Importe o script SQL fornecido (ou crie as tabelas <code>usuarios</code>, <code>quartos</code>, <code>reservas</code>).</li>
        <li>Verifique se o usuário é <code>root</code> e senha vazia. Se for diferente, edite o arquivo <code>backend/db.js</code>.</li>
    </ol>

    <h3>2. Rodar o Backend (Servidor)</h3>
    <p>Abra o terminal, entre na pasta <code>backend</code> e execute:</p>
    <pre><code>cd backend
npm install   # Instala as dependências (express, mysql2, cors...)
npm start     # Inicia o servidor na porta 3000</code></pre>
    <p><em>Você deve ver a mensagem: <code>Servidor ON na porta 3000</code></em></p>

    <h3>3. Rodar o Frontend (Site)</h3>
    <p>Abra <strong>outro terminal</strong>, entre na pasta <code>frontend</code> e execute:</p>
    <pre><code>cd frontend
npm install   # Instala as dependências (react, axios, router...)
npm run dev   # Inicia o site no modo desenvolvimento</code></pre>
    <p><em>O terminal mostrará um link (ex: <code>http://localhost:5173</code>). Clique nele para abrir.</em></p>

    <h2>🧪 Usuários para Teste</h2>
    <p>Utilize as credenciais abaixo para testar os diferentes perfis do sistema:</p>

    <table>
        <thead>
            <tr>
                <th>Tipo de Conta</th>
                <th>E-mail</th>
                <th>Senha</th>
                <th>O que pode fazer?</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Admin</strong></td>
                <td><code>admin@hotel.com</code></td>
                <td><code>admin123</code></td>
                <td>Visualizar todas as reservas, Cancelar reservas, Liberar quartos.</td>
            </tr>
            <tr>
                <td><strong>Cliente</strong></td>
                <td><code>viajante@teste.com</code></td>
                <td><code>123</code></td>
                <td>Visualizar quartos disponíveis, Fazer reservas.</td>
            </tr>
        </tbody>
    </table>

    <hr>
    <p style="text-align: center; color: #888; font-size: 0.9em;">
        Desenvolvido por Kenya Mashida &copy; 2025
    </p>

</body>
</html>