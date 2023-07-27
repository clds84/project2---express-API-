// Import Dependencies
const express = require('express')
const Meme = require('../models/Meme')
const fetch = require('node-fetch')
const { model } = require('../models/connection')
const { route } = require('./user')
var path = require('path')

////for cloudinary upload
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");

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
    Meme.find({})    
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
    Meme.find({owner: userId})
    .then((memes) => {
        
        res.render('memes/MemesIndex', {memes, userId, username, loggedIn})
        //res.send('hi')
    })
    .catch((error) => {
        console.log(error)
        res.json({error})
    })
})

//////////////
//SHOW route - page that shows user's specific meme. Will include edit, delete, and comment
///////////////
router.get('/mine/:id', (req,res) => {
    const memeId = req.params.id
    //req.body.owner = req.session.userId
   // let ID = memeBody.ID
   Meme.findById(memeId)
   .populate('comments.author')
   .then((memes) => {
        const { username, userId, loggedIn } = req.session
        
        res.render('memes/MemesShow', {memes, userId, username, loggedIn})
        //res.send('hi')
    })
    .catch((error) => {
        console.log(error)
        res.json({error})
    })
})
///////////////
//EDIT GET route - for editing user meme-specific show route
        ///////////////
router.get('/mine/:id/edit', (req,res) => {
    const memeId = req.params.id
    Meme.findById(memeId)
    .then((meme) => {
        const { username, userId, loggedIn } = req.session
        res.render('memes/MemesEdit', {meme, username, userId, loggedIn})
    })
})
//////////////
//EDIT PUT route - for editing user meme-specficic show route
        //////////////
router.put('/mine/:id', (req,res) => {
    const memeBody = req.body
    const memeId = req.params.id   
    Meme.findByIdAndUpdate(memeId, {topText: memeBody.topText, bottomText: memeBody.bottomText})
    .then((meme) => {
        const { username, userId, loggedIn } = req.session
        res.redirect(`/memes/mine/${memeId}`)
    })
    .catch((error) => {
        console.log(error)
        res.json({error})
        res.send('hi')
    })
})



// //try {
//     // Upload image to cloudinary
//     router.post("/", upload.single("image"), async (req, res) => {
//         try {
//           // Upload image to cloudinary
//           const result = await cloudinary.uploader.upload(req.file.path);
//           // Create new user
//           let meme = new Meme({
//             meme_img: result.secure_url,
//             cloudinary_id: result.public_id,
//           });
//           // save user details in mongodb
//           await memeImage.save();
//           res.status(200)
//             .send({
//               meme
//             });
//         } catch (err) {
//           console.log(err);
//         }
//       });
///////////////
//GET route - new route for creating memes
///////////////
router.get('/new', (req,res) => {
    const { username, userId, loggedIn } = req.session
    res.render('memes/MemesNew', {username, userId, loggedIn})
})
///////////////
//POST route - POST route for creating memes in /memes
///////////////
// upload.single('file'),
router.post('/', upload.single('image'), async (req,res) => {
    req.body.owner = req.session.userId
    const username = req.session.username
    const loggedIn = req.session.loggedIn
    let memeBody = req.body
    try {
        // Upload image to cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);
        memeBody.cloudinary_id = result.public_id
        memeBody.cloudinary_img = result.secure_url
        } 
    catch (err) {
        console.log(err);
    }
    Meme.create(memeBody)
        .then((memeBody) => {
            console.log('this is req body ', memeBody)
            res.redirect('/memes/mine')
        })
        .catch((err) => {
        console.log(err)
        res.json({ err })
        })
})
///////////////
//DELETE route - for deleting user meme-specific show route
///////////////
router.delete('/mine/:id/delete', async (req,res) => {
    const memeId = req.params.id
    console.log('delete route hit')
    try {
        let meme = await Meme.findByIdAndRemove(memeId);
        await cloudinary.uploader.destroy(meme.cloudinary_id)

        console.log('we are inside delete promise chain')
        const { username, userId, loggedIn } = req.session
        res.redirect(`/memes/mine`)
    }
    catch (err) {
        console.log(err)
    }
})

//Keeping this here in case an API is consumed in the future

// //POST route for liking a meme that gets stored under username in /memes/mine
// //////////////
// router.post('/viewAll', (req,res) => {
//     req.body.owner = req.session.userId
//     //  Meme.find({owner: userId})
//     //  	.then((meme) => {
//         const username = req.session.username
//         const loggedIn = req.session.loggedIn
         
//         let memeBody = req.body
//         //let topText = memeBody.topText
//         // let bottomText = memeBody.bottomText
//         // let image = memeBody.image
//         // let name = memeBody.name
//         let ID = memeBody.ID
//         // let rank = memeBody.rank
//         // let tags = memeBody.tags
        
//         Meme.create(memeBody)
//         .then((memeBody) => {
//             console.log('this is req body ', memeBody)
//                //res.redirect(`/memes/search/${ID}`)
//                 //res.send('hi')
//             })
//     //})
//     .catch((err) => {
//         console.log(err)
//         res.json({ err })
//     })
// })

/////////////
// Export the Router
////////////
module.exports = router