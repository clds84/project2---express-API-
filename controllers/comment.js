const express = require('express')
const mongoose = require('mongoose')
const Meme = require('../models/Meme')
const CommentSchema = require('../models/comment')

const router = express.Router()

///////////////
//Routes
///////////////

router.post('/:id', (req, res) => {
    const memeId = req.params.id
    console.log('first comment body', req.body)
    // we'll adjust req.body to include an author
    // the author's id will be the logged in user's id
    req.body.date = new Date().toDateString() + ' @ ' + new Date().getHours() + ':' + new Date().getMinutes()
    req.body.author = req.session.userId
    // req.body.author = req.session.username
    // req.body.username = req.session.username
    // req.body.username = req.session.username
    console.log('updated comment body', req.body)
    console.log('this is req.body.username', req.body.username)
    console.log('this is req.session.userId', req.session.userId)
    console.log('this is req.body.author',req.body.author)
    console.log('this is req.session.username',req.session.username)


    Meme.findById(memeId)
        .then(meme => {
            
            // then we'll send req.body to the comments array

            meme.comments.push(req.body)
            
            console.log('this is meme',meme)

            // save the fruit
            return meme.save()
        })
        .then(meme => {
            // redirect
            res.redirect(`/memes/mine/${meme.id}`)
        })
        // or show an error if we have one
        .catch(error => {
            console.log(error)
            res.send(error)
        })
})

//////////////
//EDIT PUT route - for editing user meme-specficic show route
//////////////
router.put('/:id/:commentId', (req,res) => {
    const memeBody = req.body
    const memeId = req.params.id 
    const commentId = req.params.commentId  
        Meme.findByIdAndUpdate(memeId, {
        '$pull': {
            'comments' : { '_id': commentId}
        }, 
    }, {new:true})
    .then((meme) => {
        console.log('this is meme', meme)
        const { username, userId, loggedIn } = req.session
        res.redirect(`/memes/mine/${memeId}`)
        console.log('this is meme after update',meme)
    })
    .catch((error) => {
        console.log(error)
        res.json({error})
        res.send('hi')
    })
})

// //////////////
// //EDIT PUT route - for editing user meme-specficic show route
// //////////////
// router.put('/:id/:commentId', (req,res) => {
//     const commentBody = req.body
//     const memeId = req.params.id 
//     const commentId = req.params.commentId  
//         Meme.findByIdAndUpdate(memeId,
//             {'comments' : { 'note': commentBody.note}
//         })

//         .then((meme) => {
//         const { username, userId, loggedIn } = req.session
//         res.redirect(`/memes/mine/${memeId}`)
//         console.log('this is meme after update',meme)
//     })
//     .catch((error) => {
//         console.log(error)
//         res.json({error})
//         res.send('hi')
//     })
// })
        
module.exports = router