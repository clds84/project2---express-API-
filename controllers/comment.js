const express = require('express')
const mongoose = require('mongoose')
const FavMeme = require('../models/favMeme')


const router = express.Router()

///////////////
//Routes
///////////////

router.post('/:id', (req, res) => {
    const memeId = req.params.id
    console.log('first comment body', req.body)
    
    // we'll adjust req.body to include an author
    // the author's id will be the logged in user's id
    req.body.author = req.session.userId
    console.log('updated comment body', req.body)
    // we'll find the fruit with the fruitId
    FavMeme.findById(memeId)
        .then(meme => {
            // then we'll send req.body to the comments array
            meme.comments.push(req.body)
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

module.exports = router