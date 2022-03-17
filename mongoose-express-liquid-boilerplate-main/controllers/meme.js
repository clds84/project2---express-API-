// Import Dependencies
const express = require('express')
//const Example = require('../models/example')
const FavMeme = require('../models/favMeme')
const fetch = require('node-fetch')
const { model } = require('../models/connection')


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
//index that shows all memes
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
//index that shows only user's memes
//////////////
router.get('/mine', (req,res) => {
    FavMeme.find({username:req.session.username})
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
//post for liking a meme that gets stored under username in /memes/mine
//////////////
router.post('/', (req,res) => {
    req.body.username = req.session.username
	FavMeme.create(req.body)
		.then((meme) => {
			console.log('this was returned from hitting like', meme)
			res.redirect('/memes')
		})
		.catch((err) => {
			console.log(err)
			res.json({ err })
		})
})
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
