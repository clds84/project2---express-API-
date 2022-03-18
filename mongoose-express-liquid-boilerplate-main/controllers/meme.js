// Import Dependencies
const express = require('express')
//const Example = require('../models/example')
const FavMeme = require('../models/favMeme')
const fetch = require('node-fetch')
const { model } = require('../models/connection')
const { route } = require('./user')


// Create router
const router = express.Router()

// Router Middleware
// Authorization middleware
// If you have some resources that should be accessible to everyone regardless of loggedIn status, this middleware can be moved, commented out, or deleted. 
router.use((req, res, next) => {
	// checking the loggedIn boolean of our session
	if (req.session.loggedIn) {
		// if they're logged in, go to the next thing(thats the controller)
		next()
	} else {
		// if they're not logged in, send them to the login page
		res.redirect('/auth/login')
	}
})
/////////////////////////////
//Routes
/////////////////////////////

//////////////
//GET route- index that shows all memes
//////////////
router.get('/', (req,res) => {
    
    //find all liked memes
    FavMeme.find({})    
        .then((memes) => {
            const username = req.session.username
            const loggedIn = req.session.loggedIn
            res.render('memes/index', {memes, username, loggedIn})
            //res.send('hi')
        })
        .catch((error) => {
            console.log(error)
            res.json({error})
        })
})
//////////////
//GET route - index that shows only user's memes
//////////////
router.get('/mine', (req,res) => {
    const { username, userId, loggedIn } = req.session
    FavMeme.find({owner: userId})
    .then((memes) => {
        
        res.render('memes/favMemesIndex', {memes, userId, username, loggedIn})
        //res.send('hi')
    })
    .catch((error) => {
        console.log(error)
        res.json({error})
    })
})


///////////////
//GET route - new route for creating memes
///////////////
router.get('/new', (req,res) => {
    const { username, userId, loggedIn } = req.session
    res.render('memes/favMemesNew', {username, userId, loggedIn})
})
///////////////
//POST route - POST route for creating memes in /memes
///////////////
router.post('/', (req,res) => {
    req.body.owner = req.session.userId
    //  FavMeme.find({owner: userId})
    //  	.then((meme) => {
        const username = req.session.username
        const loggedIn = req.session.loggedIn
         
        let memeBody = req.body
        let topText = memeBody.topText
        // let bottomText = memeBody.bottomText
        // let image = memeBody.image
        // let name = memeBody.name
        let ID = memeBody.ID
        // let rank = memeBody.rank
        // let tags = memeBody.tags
        
        FavMeme.create(memeBody)
        .then((memeBody) => {
            console.log('this is req body ', memeBody)
                res.redirect('/memes')
                //res.send('hi')
            })
    //})
    .catch((err) => {
        console.log(err)
        res.json({ err })
    })
})
//SHOW route - page that shows user's specific meme. Will include edit, delete, and comment
///////////////
router.get('/mine/:id', (req,res) => {
    const memeId = req.params.id
    //req.body.owner = req.session.userId
   // let ID = memeBody.ID
   FavMeme.findById(memeId)
   .then((memes) => {
        const { username, userId, loggedIn } = req.session
        
        res.render('memes/favMemesShow', {memes, userId, username, loggedIn})
        //res.send('hi')
    })
    .catch((error) => {
        console.log(error)
        res.json({error})
    })
})
///////////////
//DELETE route - for deleting user meme-specific show route
///////////////




///////////////
//EDIT GET route - for editing user meme-specific show route
        ///////////////
        router.get('/mine/:id/edit', (req,res) => {
            const memeId = req.params.id
            FavMeme.findById(memeId)
            .then((meme) => {
                const { username, userId, loggedIn } = req.session
                res.render('memes/favMemesEdit', {meme, username, userId, loggedIn})
            })
        })
        //////////////
        //EDIT PUT route - for editing user meme-specficic show route
                //////////////
                router.put('/mine/:id', (req,res) => {
                    const memeId = req.params.id   
                    FavMeme.findByIdAndUpdate(memeId)
                    .then((meme) => {
                        const { username, userId, loggedIn } = req.session
                        res.redirect(`/memes/mine/${memeId}`, {meme, userId, username, loggedIn})
                    })
                    .catch((error) => {
                        console.log(error)
                        res.json({error})
                        res.send('hi')
                    })
                })
        router.delete('/mine/:id/delete', (req,res) => {
            const memeId = req.params.id
            console.log('delete route hit')
            FavMeme.findByIdAndRemove(memeId)
            .then((meme) => {
                console.log('we are inside delete promise chain')
                const { username, userId, loggedIn } = req.session
                res.redirect(`/memes/mine`)
            })
                    .catch((error) => {
                        console.log(error)
                        res.json({error})
                    })
        })
        //POST route for liking a meme that gets stored under username in /memes/mine
        //////////////
        router.post('/', (req,res) => {
            req.body.owner = req.session.userId
            //  FavMeme.find({owner: userId})
            //  	.then((meme) => {
                const username = req.session.username
                const loggedIn = req.session.loggedIn
                 
                let memeBody = req.body
                let topText = memeBody.topText
                // let bottomText = memeBody.bottomText
                // let image = memeBody.image
                // let name = memeBody.name
                let ID = memeBody.ID
                // let rank = memeBody.rank
                // let tags = memeBody.tags
                
                FavMeme.create(memeBody)
                .then((memeBody) => {
                    console.log('this is req body ', memeBody)
                        res.redirect(`/memes/search/${ID}`)
                        //res.send('hi')
                    })
            //})
            .catch((err) => {
                console.log(err)
                res.json({ err })
            })
})

//
//////////////
//
//////////////

//////////////
//
//////////////


router.get('/search', (req, res) => {
    console.log('this is my get route: memes/search ')
    const { username, userId, loggedIn } = req.session
       //res.send('hi')
    res.render('memes/search', {loggedIn, username, userId })
           
})
////////////////
//post route for page-specific path in show route below
////////////////    
router.post('/search', (req, res) => {
    console.log('this is my post: /memes/${page}')
    const page = req.body.page
    console.log('this is the page ', page)
    res.redirect(`/memes/search/${page}`)  

 })
 ////////////////
 //show route - get route that takes us to specific meme page 
 ///////////////
router.get('/search/:memePage', (req, res) => {
    console.log('this is my get: memes/searchShow')
    const { username, userId, loggedIn } = req.session
    const page = parseInt(req.params.memePage)
    const requestURL = `http://alpha-meme-maker.herokuapp.com/${page}`
     fetch(requestURL)
        .then(responseData => {
            return responseData.json()
        })
        .then(jsonMemeData => {
            console.log(jsonMemeData)
            res.render('memes/searchShow', {memeData: jsonMemeData, loggedIn, username, userId} )
        })
        .catch(error => {
            res.send(error)
        })
})
/////////////
// Export the Router
////////////
module.exports = router
