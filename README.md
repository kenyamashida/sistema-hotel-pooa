🏨 Sistema de Gerenciamento de Hotel

Projeto desenvolvido para a disciplina de Programação Orientada a Objetos (POO).
Trata-se de um sistema Full Stack completo com Backend (Node/Express), Frontend (React/Vite) e Banco de Dados (MySQL).

⭐ Funcionalidades Principais

Autenticação de Usuários (Login/Cadastro)

Níveis de acesso distintos (Admin vs Cliente)

Dashboard interativo com fotos dos quartos

Sistema de Reservas em tempo real

🚀 Como rodar o projeto

Este projeto está dividido em duas partes (servidor e site).
Você precisará de dois terminais abertos simultaneamente.

1. Configurar o Banco de Dados

Abra o seu MySQL (XAMPP/Workbench).

Crie um banco de dados chamado projeto_pooa (ou o nome que estiver no arquivo db.js).

Importe o script SQL fornecido (ou crie as tabelas usuarios, quartos, reservas).

Verifique se o usuário é root e senha vazia.

Se for diferente, edite o arquivo backend/db.js.


2. Rodar o Backend (Servidor)

Abra o terminal, entre na pasta backend e execute:
'''
cd backend
npm install   # Instala as dependências (express, mysql2, cors...)
npm start     # Inicia o servidor na porta 3000
'''

Você deve ver a mensagem:
'''
Servidor ON na porta 3000
'''
3. Rodar o Frontend (Site)

Abra outro terminal, entre na pasta frontend e execute:
'''
cd frontend
npm install   # Instala dependências (react, axios, router...)
npm run dev   # Inicia o site no modo desenvolvimento
'''

O terminal mostrará um link como:
'''
http://localhost:5173
'''

Clique nele para abrir o site.

🧪 Usuários para Teste

Utilize as credenciais abaixo para testar os diferentes perfis do sistema:
'''
Tipo de Conta	E-mail	Senha	O que pode fazer?
Admin	admin@hotel.com	admin123	Visualizar todas as reservas, cancelar reservas, liberar quartos.
Cliente	viajante@teste.com	123	Visualizar quartos disponíveis, fazer reservas.
'''

Dependências:

# Entrar na pasta do projeto
cd sistema-hotel-pooa

# Instalar Backend
cd backend
npm install

# Voltar e Instalar Frontend
cd ..
cd frontend
npm install
