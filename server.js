const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Student = require('./model/student')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk'

mongoose.connect('mongodb://localhost:27017/login-app-db')

const app = express()
app.use('/', express.static(path.join(__dirname, 'static')))
app.use(bodyParser.json())

app.get("/students/me", function(req, res){
	const authHeader =  req.headers.authorization.split('Bearer ')[1]
	jwt.verify(authHeader, JWT_SECRET, (err, decoded) => {
		if (err) return res.sendStatus(403)
		Student.findById(decoded.id, function(err, foundStudent) {
			if(err) {
				req.flash("error", "Problème");
				req.redirect("/");
			}
			res.json({student: foundStudent});
		})
	})
});

app.post('/api/change-password', async (req, res) => {
	const { token, newpassword: plainTextPassword } = req.body

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

	try {
		const student = jwt.verify(token, JWT_SECRET)

		const _id = student.id

		const password = await bcrypt.hash(plainTextPassword, 10)

		await Student.updateOne(
			{ _id },
			{
				$set: { password }
			}
		)
		res.json({ status: 'ok' })
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: ';))' })
	}
})

app.post('/api/login', async (req, res) => {
	const { codeine, password } = req.body
	const student = await Student.findOne({ codeine }).lean()

	if (!student) {
		return res.json({ status: 'error', error: 'Invalid codeine/password' })
	}

	if (await bcrypt.compare(password, student.password)) {
		// the username, password combination is successful

		const token = jwt.sign(
			{
				id: student._id,
				codeine: student.codeine
			},
			JWT_SECRET
		)

		return res.json({ status: 'ok', data: token })
	}

	res.json({ status: 'error', error: 'Invalid username/password' })
})

app.post('/api/register', async (req, res) => {
	const { codeine, password: plainTextPassword, prenom, nom } = req.body

	if (!codeine || typeof codeine !== 'string') {
		return res.json({ status: 'error', error: 'Invalid username' })
	}

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

	if (!prenom || typeof prenom !== 'string') {
		return res.json({ status: 'error', error: 'Invalid prenom' })
	}

	if (!nom || typeof nom !== 'string') {
		return res.json({ status: 'error', error: 'Invalid nom' })
	}

	const password = await bcrypt.hash(plainTextPassword, 10)

	try {
		const response = await Student.create({
			codeine,
			password,
			prenom,
			nom
		})
		console.log('Student created successfully: ', response)
	} catch (error) {
		if (error.code === 11000) {
			// duplicate key
			return res.json({ status: 'error', error: 'Username already in use' })
		}
		throw error
	}

	res.json({ status: 'ok' })
})

app.listen(9999, () => {
	console.log('Server up at 9999')
})
