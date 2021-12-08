const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const Student = require('./model/student')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_TOKEN = 'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0'

mongoose.connect('mongodb://localhost:27017/login-app-db')
const app = express()
app.use('/', express.static(path.join(__dirname, 'static')))
app.use(bodyParser.json())

app.post('/api/login', async (req, res) => {
    const { codeine, password } = req.body
    const student = Student.findOne({ codeine, password }).lean()

    if(!user){
        return res.json({ status: 'error', error: 'Code INE incorrect ou mot de passe incorrect' })      
    }

    if(await bcrypt.compare(password, student.password)){
        const token = jwt.sign({ id: student._id, codeine: student.codeine }, JWT_TOKEN)
    }
})

app.post('/api/register', async (req, res) => {

    const { codeine, password: plainTextPassword } = req.body

    if(!codeine || typeof codeine !== 'string'){
        return res.json({ status: 'error', error: 'Code INE faux' })
    }

    if(!plainTextPassword || typeof plainTextPassword !== 'string'){
        return res.json({ status: 'error', error: 'Mot de passe invalide' })
    }

    if(plainTextPassword.length < 5){
        return res.json({ status: 'error', error: 'Mot de passe trop petit, minimum 6 caractères' })
    }

    const password = await bcrypt.hash(plainTextPassword, 12)

    try {
        await Student.create({
            codeine,
            password
        })

    } catch(error) {
        if(error.code === 11000){
            return res.json({ status: 'error', error: 'Code INE faux' })
        }
        throw error
    }
    res.json({ status: 'ok' })
})

app.listen(9999, () => {
    console.log('Serveur OK')
})