const { Router } = require('express')
const router = Router()
const auth = require('../controllers/auth')

router.get('/', (req, res) => {
    res.render('login/index.pug')
})

router.get('/dashboard', auth, (req, res) => {
    let site = "dv"
    let nombreArea = "Dashboard Vales"
    res.render('dashboard/dashboard.pug', { LOC: site, nombreArea: nombreArea })
})

module.exports = router