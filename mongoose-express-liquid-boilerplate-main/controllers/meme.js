// Import Dependencies
const express = require('express')
//const Example = require('../models/example')
const FavMeme = require('../models/favMeme')
const fetch = require('node-fetch')


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

		////////////
		router.get('/search', (req, res) => {
            const { username, userId, loggedIn } = req.session
               //res.send('hi')
                   res.render('memes/search', {loggedIn, username, userId })
           
       })
       
       router.post('/search', (req, res) => {
           const page = req.body.page
           console.log('this is the page ', page)
           res.redirect(`/memes/${page}`)  
           
        })
        router.get('/:memePage', (req, res) => {
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
module.exports = router