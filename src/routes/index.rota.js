// // console.log('tudo certo')

// const express = require('express')
// const router = express.Router()
// const { Posts, Usuario} = require('../db/models')
// const moment = require('moment')
// const { Model } = require('sequelize')
// moment.locale('pt-br')


// router.get('/home',  async (req, res) => {
//     const posts = await Posts.findAll({
//         include: [{ model: Usuario }], raw: true, nest: true
//     })
//      const postResult = posts.map((post)=> preparaResultado(post))
//     res.render('pages/posts', {posts: postResult, layout: 'layouts/layout-blog.ejs'})


//         })
  

// function preparaResultado(post){
//     const result = Object.assign({}, post)
//      result.postadoEm = moment(new Date(result.createdAt)).format('DD [de] MMMM [de] yyyy [as] HH:mm')


//     if(result.createAt){
//         delete result.createAt
//     }

//     if(result.userId){delete result.userId}
//     if(result.createAt){delete result.createAt}
//      if(result.updateAt){delete result.updateAt}
//      if(result.usuarios){
//         if(result.usuarios.senha){
//             delete usuarios.senha
//         }
//      }

//             return result
// }

// module.exports = router

    const express = require('express')
    const router = express.Router()
    const { Post, usuarios } = require('../db/models')
    const moment = require('moment')
    moment.locale('pt-br')

    router.get('/', async (req, res) => {
            const posts = await Post.findAll({
                    include: [{model: usuarios,
                    as: 'usuario'}], raw: true, nest: true
            })
            
            console.log(posts)
            const postResult = posts.map((post) => prepararResultado(post))
            res.render('posts', {posts: postResult, layout: 'layouts/layout-blog.ejs'})
    })

    function prepararResultado(post){

            const result = Object.assign({}, post)
            result.postadoEm = moment(new Date(result.createdAt)).format('DD [de] MMMM [de] yyyy [as] HH:mm')

            if (result.createdAt) delete result.createdAt
            if (result.updatedAt) delete result.updatedAt
            if (result.userId) delete result.userId
            if (result.Usuario){
                    if (result.Usuario.senha) delete result.Usuario.senha
                    if (result.Usuario.createdAt) delete result.Usuario.createdAt
                    if (result.Usuario.updatedAt) delete result.Usuario.updatedAt
            }
            return result
    }

    module.exports = router