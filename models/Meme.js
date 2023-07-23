// import dependencies
const { Mongoose } = require('./connection')
const mongoose = require('./connection')
const commentSchema = require('./comment')

// import user model for populate
const User = require('./user')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose
//uniqe : true
const MemeSchema = new Schema(
	{
		ID: { type: Number, required: false },
		bottomText: { type: String, required: false },
		topText: {type: String, required: false},
        image: { type: String, required: false },
		file:{ data: Buffer, contentType: String },
		name: { type: String, required: false},
		rank: {type: Number, required: false},
		tags: {type: String, required: false},
		date: {type: Date, required: false},
		owner: {
			type: Schema.Types.ObjectID,
			ref: 'User',
		},
		comments: [commentSchema]
		}, { timestamps: true })



const Meme = model('Meme', MemeSchema)

module.exports = Meme