const { Router } = require('express')
const router = Router()

router.get('/404', (req, res) => res.render('errorsHttp/error404.pug'))
router.get('/500', (req, res) => res.render('errorsHttp/error500.pug'))

module.exports = router