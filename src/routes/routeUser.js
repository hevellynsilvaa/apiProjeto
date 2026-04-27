
const express = require('express')
const router = express.Router()
const {v4: uuidv4} = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const {usuarios} = require('../db/models');

const usuarioMid = require("../middleware/validarUser.middleware")
router.post('/', usuarioMid)
router.put('/', usuarioMid)


router.get('/:id', async (req, res) => {
    const user = await usuarios.findByPk(req.params.id)
    if (user) {
        res.json({ usuario: preparaResultado(user.dataValues)})
    }else{
        res.status(400).json({ msg: "usuário não encontrado! "})
    }
 
    })


  
router.put('/', async (req, res) => {
    const id = req.query.id
    const user = await usuarios.findByPk(id)

    if (user){
        user.email = req.body.email
        user.senha = req.body.senha
        await this.post.save()
        res.json({msg: "USUÁRIO ATAULIZADO COM SUCESSO"})
    }else{
        res.status(400).json({msg:  "usuario não encontrado"})
    }
})


router.delete('/', async (req, res) => {
    const id = req.query.id
    const user = await usuarios.findByPk(id)
    // se existir, deleto o objeto do id que foi passado
  if (user){
        await user.destroy()
        res.json({msg:"USUARIO DELETADO COM SUCESSO" })
        }else{
            res.status(400).json({msg: "usuário não encontrado"})
        }

})


router.post('/', async (req, res)=> {
        const senha = req.body.senha
        const salt = await bcrypt.genSalt(10)
        const senhacrypto = await bcrypt.hash(senha, salt)
        const usuario = {email: req.body.email, senha: senhacrypto} 
        const usuarioObj = await usuarios.create(usuario)    
        res.json({msg: "Usuario adicionado com sucesso!!", userId: usuarioObj.id})

})

router.post('/login', async (req, res) => {
    const email = req.body.email
    const senha = req.body.senha

    const usuario = await usuarios.findOne({
        where: {email : email}
    });
    if (usuario && await (bcrypt.compare(senha, usuario.senha))){
        
                const payload = {
                    sub: usuario.id, 
                    iss: 'imd-backend', 
                    aud: 'imd-frontend',
                    email: usuario.email}
                    const token = jwt.sign(payload, process.env.ACESS_TOKEN_SECRET, {expiresIn: 3000})
                        res.json({acessToken: token})
        console.log('sucesso!')
    }else {
        console.log('falha ao autenticar!')
    }


})


router.get('/', async (req, res) => {
    const users = await usuarios.findAll()
    const resultado = users.map(usuarios => preparaResultado(usuarios.dataValues))
    res.json({ usuarios:  resultado })
})

  function preparaResultado(usuarios){
    const result = Object.assign({}, usuarios)

    if(result.createAt){
        delete result.createAt
    }

    if(result.createdAt){delete result.createdAt}
     if(result.updatedAt){delete result.updatedAt}
     if(result.usuarios){
        if(result.senha){delete result.senha}}

    return result
}



module.exports = router


// const express = require('express')
// const router = express.Router()
// const { v4: uuidv4 } = require('uuid')

// const usuarios = {}




// const Ajv = require('ajv')
// const ajv = new Ajv()
// const addFormats = require("ajv-formats")
// addFormats(ajv)

// router.post('/', (req, res) => {
//     const usuario = req.body

//         const validate = ajv.compile(usuarioSchema)
//         const valid = validate(usuario)

//         if (valid){
//           const idUsuario = uuidv4()
//       usuario.id = idUsuario
//       usuarios[idUsuario] = usuario
//       res.json({msg: "Usuário adicionado com sucesso!"})
//         }else{
//            res.status(400).json({msg: "Dados inválidos", errors: validate.errors})
//         }

// })







// router.get('/:id', (req, res) => {
//     res.json({usuarios: usuarios[req.params.id]})
// })

// router.put('/', (req, res) => {
//     const id = req.query.id
//     if (id && usuarios[id]){
//         const usuario = req.body
//         usuario.id = id
//         usuarios[id] = usuario
//         res.json({msg: "Usuário atualizado com sucesso!"})
//     }else{
//         res.status(400).json({msg: "Usuário não encontrado!"})
//     }
// })

// router.delete('/', (req, res) => {
//     const id = req.query.id
//     if (id && usuarios[id]){
//         delete usuarios[id]
//         res.json({msg: "Usuário deletado com sucesso!"})
//     }else{
//         res.status(400).json({msg: "Usuário não encontrado!"})
//     }
// })



// module.exports = router