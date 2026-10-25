# API de Autenticação com Node.js e MongoDB

API REST desenvolvida com Node.js, Express e MongoDB para praticar cadastro de usuários, login e autenticação baseada em tokens JWT. As senhas são armazenadas com hash gerado pelo bcrypt, e as credenciais do banco e o segredo do token são lidos de variáveis de ambiente.
Tecnologias utilizadas
- Node.js — ambiente de execução JavaScript.
- Express — criação do servidor e das rotas HTTP.
- MongoDB Atlas — banco de dados utilizado pela aplicação.
- Mongoose — conexão com o MongoDB e manipulação dos usuários.
- bcrypt — geração e comparação de hashes de senhas.
- jsonwebtoken (JWT) — criação e validação de tokens.
- dotenv — leitura das variáveis de ambiente do arquivo .env.

# Funcionalidades implementadas
- Responder a uma rota pública de teste.
- Cadastrar usuários com nome, e-mail, senha e confirmação de senha.
- Validar campos obrigatórios e verificar se o e-mail já está cadastrado.
- Armazenar a senha em formato de hash, em vez de texto puro.
- Autenticar usuários por e-mail e senha.
- Gerar um token JWT após o login bem-sucedido.
- Buscar um usuário pelo ID sem retornar o campo password.
- Disponibilizar uma função de middleware para verificar tokens JWT.
