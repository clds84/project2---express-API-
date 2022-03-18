////////////////////
//  Dependencies  //
////////////////////
require("dotenv").config() // make env variables available
const fetch = require('node-fetch')
const express = require("express")
const middleware = require('./utils/middleware')
//const ExampleRouter = require('./controllers/example')
const UserRouter = require('./controllers/user')
const memeRouter = require('./controllers/meme')
const User = require("./models/user")

// SEE MORE DEPENDENCIES IN ./utils/middleware.js
// user and resource routes linked in ./utils/middleware.js

//////////////////////////////
// Middleware + App Object  //
//////////////////////////////
const app = require("liquid-express-views")(express())

middleware(app)

////////////////////
//    Routes      //
////////////////////

app.use('/memes', memeRouter)
app.use('/auth', UserRouter)
//app.use('/examples', ExampleRouter)

// app.get('/', (req, res) => {
//     const { username, userId, loggedIn } = req.session
	
// 			res.render('index.liquid', {loggedIn, username, userId })
	
// })
// app.get('/:memePage', (req, res) => {
// 	const { username, userId, loggedIn } = req.session
// 	const page = parseInt(req.params.memePage)
// 	const requestURL = `http://alpha-meme-maker.herokuapp.com/${page}`
//      fetch(requestURL)
//         .then(responseData => {
//             return responseData.json()
//         })
//         .then(jsonMemeData => {
//             console.log(jsonMemeData)
//             res.render('show', {memeData: jsonMemeData, username,userId,loggedIn})
//         })
//         .catch(error => {
//             res.send(error)
//         })
// })

// app.post('/', (req, res) => {
//     const page = req.body.page
// 	console.log('this is the page ', page)
//     res.redirect(`/${page}`)  
	
// })

app.get('/error', (req, res) => {
	const error = req.query.error || 'This Page Does Not Exist'
    const { username, loggedIn, userId } = req.session
	res.render('error.liquid', { error, username, loggedIn, userId })
})

// if page is not found, send to error page
app.all('*', (req, res) => {
	res.redirect('/error')
})



//////////////////////////////
//      App Listener        //
//////////////////////////////
app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`)
})