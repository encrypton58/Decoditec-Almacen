const { Router } = require('express')
const router = Router()
const cLogin = require('../controllers/loginController')


router.post('/login', (req, res) => cLogin.loginUser(req, res))

router.post('/register', cLogin.registerUser)

router.get('/registerform', (req, res) => {
    res.render('login/registerUser.pug')
})


module.exports = router