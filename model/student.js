const mongoose = require('mongoose')
const StudentSchema = new mongoose.Schema(
	{
		codeine: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		prenom: { type: String, required: true },
		nom: { type: String, required: true }
	},
	{ collection: 'student' }
)
const model = mongoose.model('StudentSchema', StudentSchema)
module.exports = model