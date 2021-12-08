const mongoose = require('mongoose')

const StudentSchema = new mongoose.Schema({
    codeine: { type: String, required: true, unique: true },
    password: { type: String, required: true }
},{ collection: 'students' })

const model = mongoose.model('StudentSchema', StudentSchema)
module.exports = model