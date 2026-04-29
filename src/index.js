// console.log('tudo certo')
 // "start": "npx sequelize-cli db:migrate && cross-env NODE_ENV=development nodemon -e yaml,js,json --exec node src/index.js",
const express = require('express')
const app = express()
app.use(express.json())

const helmet = require('helmet')
app.use(helmet())
const { Post } = require('./db/models')
const postROTA = require('./routes/routePost')
const  expressLayouts = require('express-ejs-layouts')

require('dotenv').config()
 const swaggerUi = require('swagger-ui-express');
 const YAML = require('yamljs');
 const swaggerDocument = YAML.load('./api.yaml');

 app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
const usuarioRota =  require('./routes/routeUser')
const indexRoute = require('./routes/index.rota')

app.set('view engine', 'ejs')
app.use(expressLayouts)


app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use('/', indexRoute)
app.set('layout', 'layouts/layout')
app.use('api/posts', postROTA)
app.use('api/usuarios', usuarioRota)
  app.use('/static', express.static('public'))
  const cors = require("cors");

app.use(cors({
  origin: "https://apiprojeto-2.onrender.com/api"
}));
const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();
const PORT = process.env.PORT || 8080

// app.get('/home',(req, res) =>{
//     res.render('posts', { posts: postResult })
// })

// monta o router em /posts (ou o prefixo que desejar)

app.get('/api', (req, res) => {
    res.json({msg: "Hello from Express!"})
})

const server = app.listen(PORT)

server.on('listening', ()=> {
    console.log(`servidor pronto na porta ${PORT}`)
})



server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Erro: a porta ${PORT} já está em uso. Use outra porta ou encerre o processo que a está usando.`)
    } else {
        console.error('Erro ao iniciar o servidor:', err.message)
    }
    process.exit(1)
})
