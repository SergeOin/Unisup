const mongoose = require('mongoose')
const UniversitySchema = new mongoose.Schema(
	{
		codeuniversity: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		universityname: { type: String, required: true },
	},
	{ collection: 'university' }
)
const model = mongoose.model('UniversitySchema', UniversitySchema)
module.exports = model