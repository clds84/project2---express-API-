///////////////////////////////////////
// Import Dependencies
///////////////////////////////////////
const mongoose = require('./connection')
const Meme = require('./Meme')

///////////////////////////////////////////
// Seed Code
////////////////////////////////////////////
// save the connection in a variable
const db = mongoose.connection;

db.on('open', () => {
	// array of starter fruits
	const starterMemes = [
		{ 	image: "https://i.imgur.com/A6XNHAJ.png", 
			bottomText: '', 
			topText: `I don't understand` 
		},
		{ 	image: "https://i.imgur.com/s4UjXJr.png", 
			bottomText: 'I can have a decent computer', 
			topText: `maybe now that I'm king`
		},
		{ 	image: "https://i.imgur.com/dQilOyJ.png", 
			bottomText: 'is not easy', 
			topText: 'being a 1900s steel conglomerate tycoon' 
		},
		{ 	image: "https://i.imgur.com/ekiP0wy.png", 
			bottomText: '', 
			topText: `..P....O..G....G..E..R..S` 
		},
		{ 	image: "https://i.imgur.com/fwwtY7H.png", 
			bottomText: '', 
			topText: `I think I see a 2 liter Mug` 
		},
		{ 	image: "https://i.imgur.com/ke8dB0Y.png", 
			bottomText: 'Uncle Timm looking at our indentation', 
			topText: '' 
		},
		{ 	image: "https://i.imgur.com/8wTWczx.jpg", 
			bottomText: `'Yeah sorry my video is messed up'`, 
			topText: 'Zoom Meeting' 
		},
		{ 	image: "https://i.imgur.com/cUj7KNS.png", 
			bottomText: 'is modern day Shakespeare', 
			topText: 'Trailer Park Boys' 
		},
		{ 	image: "https://i.imgur.com/FiNm6LG.jpg", 
			bottomText: `Honey I'm home`, 
			topText: '' 
		},
		{ 	image: "https://i.imgur.com/ufCyq68.jpg", 
			bottomText: `I thought this was the address to Pasquale's`, 
			topText: '' 
		}
    ]

	// when we seed data, there are a few steps involved
	// delete all the data that already exists(will only happen if data exists)
	Meme.remove({})
        .then(deletedMemes => {
		    console.log('this is what remove returns', deletedMemes)
		    // then we create with our seed data
            Meme.create(starterMemes)
                .then((data) => {
                    console.log('Here are the new seed fruits', data)
                    db.close()
                })
                .catch(error => {
                    console.log(error)
                    db.close()
                })
	    })
        .catch(error => {
            console.log(error)
            db.close()
        })
	// then we can send if we want to see that data
})