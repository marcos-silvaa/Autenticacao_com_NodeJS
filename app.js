//Importes

require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()

// Configuração DNS
const dns = require('dns')
dns.setServers(['8.8.8.8', '8.8.4.4'])

// Configuração Json resposta

app.use(express.json())

// Importação da pasta models no projeto

const User  = require('./models/User')

// Rota pública
app.get('/',(req,res) => {
    res.status(200).json({ msg: 'Olá mundo'})
})

// Rota privada 

app.get('/user/:id', async (req, res) => {
    const id = req.params.id

    try {
        // Verificar se o usuário existe
        const user = await User.findById(id, '-password')

        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado' })
        }

        return res.status(200).json({ user })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: 'Erro no servidor, tente novamente mais tarde' })
    }
})

// Verificar token

function checkToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ msg: 'Acesso negado!' })
    }

    try {
        const secret = process.env.SECRET
        jwt.verify(token, secret)
        next()
    } catch (error) {
        return res.status(400).json({ msg: 'Token inválido!' })
    }
}


// Registrar Usuario

app.post('/auth/register', async (req, res) => {
    const { name, email, password, confirmpassword } = req.body || {}

    // Validação
    if (!name) {
        return res.status(422).json({ msg: 'O nome é obrigatório' })
    }
    if (!email) {
        return res.status(422).json({ msg: 'O email é obrigatório' })
    }
    if (!password) {
        return res.status(422).json({ msg: 'A senha é obrigatória' })
    }
    if (password !== confirmpassword) {
        return res.status(422).json({ msg: 'As senhas não conferem' })
    }

    try {
        // Verifica se o usuário já existe
        const userExists = await User.findOne({ email: email })
        if (userExists) {
            return res.status(422).json({ msg: 'Esse email já está em uso' })
        }

        // Cria a senha criptografada
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        // Cria e salva o usuário
        const user = new User({
            name,
            email,
            password: passwordHash,
        })
        await user.save()

        return res.status(201).json({ msg: 'Usuário criado com sucesso' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: 'Erro no servidor, tente novamente mais tarde' })
    }
})

// Login do usuario

app.post("/auth/login",async(req,res)=>{
    const {email,password} = req.body || {}

    // Validação do login

    if (!email) {
        return res.status(422).json({ msg: 'O email é obrigatório' })
    }
    if (!password) {
        return res.status(422).json({ msg: 'A senha é obrigatória' })
    }    

    // Verificar login do usuario
    const user = await User.findOne({ email: email })
    if (!user) {
        return res.status(404).json({ msg: 'Usuario não encontrado' })
    }

    // Verificar senha do usuario
    const checkpassword = await bcrypt.compare(password,user.password)

    if (!checkpassword){
        return res.status(422).json({msg : 'Senha inválida!'})
    }

    try{

        const secret = process.env.SECRET
        const token = jwt.sign(
        {
            id: user._id,
        },
        secret,
    )

        res.status(200).json({msg : 'Autenticação realizada com sucesso',token})

    }catch(erro){
        console.log(error)

        res.status(500).json({
            msg: 'Aconteceu um erro no servidor, tente novamente mais tarde!'
        })
    }
    
})

// Credenciais

const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

mongoose
    .connect(`mongodb+srv://${dbUser}:${dbPassword}@autenticacaonodejs.i1ruaog.mongodb.net/?appName=AutenticacaoNodeJs`,)
    .then(() => {
        app.listen(3000)
        console.log('conectou ao banco!')
    })
.catch((err)=> console.log(err))