const mongoose = require('mongoose')
const UniversitySchema = new mongoose.Schema(
	{
		codeine: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		prenom: { type: String, required: true },
		nom: { type: String, required: true }
	},
	{ collection: 'university' }
)
const model = mongoose.model('UniversitySchema', UniversitySchema)
module.exports = model