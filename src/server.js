require('dotenv').config();
const express = require('express');
const knex = require('knex')(require('./knexfile').development);
const bcrypt = require('bcryptjs');

const aplicacao = express();
aplicacao.use(express.json());

// Rota para cadastro de usuários
aplicacao.post('/usuarios', async (requisicao, resposta) => {
  const { nome, email, senha } = requisicao.body;
  try {
    // Criptografa a senha
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    await knex('usuarios').insert({
      nome,
      email,
      senha: senhaCriptografada,
      role: 'usuario'
    });
    resposta.status(201).json(
      { mensagem: 'Usuário cadastrado com sucesso.' }
    );
  } catch (erro) {
    console.log("🚀 ~ aplicacao.post ~ erro:", erro)
    resposta.status(500).json({ erro: 'Erro ao cadastrar usuário.' });
  }
});

// Iniciar o servidor
const PORTA = process.env.PORT || 3000;
aplicacao.listen(PORTA, () => {
  console.log(`Servidor rodando na porta ${PORTA}`);
});