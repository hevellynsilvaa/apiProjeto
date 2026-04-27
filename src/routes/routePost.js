const express = require('express')
const router = express.Router()
const postMid = require('../middleware/validarPost.md')
const { Post, usuarios } = require('../db/models')
const autenticar = require('../middleware/autenticacao.mid')

 var  multer   =  require ( 'multer' ) 

var path = require('path')




var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads'); // pasta onde os arquivos serão salvos
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
    cb(null, name);
  }
});


const fileFilter = (req, file, cb)=> {
    const extensoes = /jpeg|jpg/i
    if (extensoes.test(path.extname(file.originalname))){
        cb(null, true)
    }else{
        return cb('Arquivo não suportado. Apenas jpeg e jpg são suportados')
    }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

router.post('/', autenticar, upload.single('foto'))
router.post('/', autenticar, postMid)
router.put('/', autenticar, postMid)


router.post(
  '/', 
  upload.single('foto'),
  postMid,
  async (req, res) => {
    try {
      const data = req.body;

      console.log('BODY:', data);
      console.log('FILE:', req.file);

      if (req.file) {
        data.foto = `/static/uploads/${req.file.filename}`;
      }

      const post = await Post.create(data);

      console.log('CRIADO:', post);

      res.json({
        msg: 'POST ADICIONADO COM SUCESSO',
        post
      });

    } catch (err) {
      console.error('ERRO:', err);
      res.status(500).json({ error: err.message });
    }
  }
);


router.get('/:id', async (req, res) => {
    const post = await Post.findByPk(req.params.id, 
        {include: [{model: usuarios}], raw: true, nested: true})
    const postProcessado = preparaResultado(post)
    res.json({posts: postProcessado})
})

router.get('/', async (req, res)=> {
    const posts = await Post.findAll()
    res.json({LISTANDO_TODOS_OS_POSTS: posts})
})



router.post('/', async (req, res)=> {
    const data = req.body
    if(req.file){
        data.foto = `/static/uploads/${req.file.filename}`
    }
     const post = await Post.create(data)
    res.json({msg: 'POST ADICIONADO COM SUCESSO'})

})


router.post('/:id/upload', upload.single('foto'), async (req, res) => {

    const id = req.params.id
    const post = await Post.findByPk(id)
    if(post){
        post.foto = `/static/uploads/${req.file.filename}`
        await post.save()
        res.json({msg:  "Upload realizado com sucesso."})
    }else{
        res.status(400).json({msg:  "post não encontrado"})
    }
})

router.put('/', async (req, res) => {

    const id = req.query.id
    const post = await Post.findByPk(id)

    if(post){
        post.titulo = req.body.titulo
        post.texto = req.body.texto
        await post.save()
        res.json({msg:  "O post foi atualizado."})
    }else{
        res.status(400).json({msg:  "post não encontrado"})
    }
})


router.delete('/', async (req, res) => {
    const id = req.query.id
     const post = await Post.findByPk(id)
    if(post){
    await post.destroy()
    res.json({msg: "Post deletado com sucesso"})
    }else{
        res.status(400).json({msg: "Post não encontrado"})
    }
    // se existir, deleto o objeto do id que foi passado

})



function preparaResultado(post){
    const result = Object.assign({}, post)

    if(result.createAt){
        delete result.createAt
    }

    if(result.userId){delete result.userId}
    if(result.createAt){delete result.createAt}
     if(result.updateAt){delete result.updateAt}
     if(result.usuarios){
        if(result.usuarios.senha){
            delete usuarios.senha
        }
     }

    return result
}

// router.get('/posts/:id', (req, res, ) => {
//     res.json({posts: posts[req.params.id]})

// })





module.exports = router