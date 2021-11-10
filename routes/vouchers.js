const { Router } = require('express')
const router = Router()
const auth = require('../controllers/auth')
const cVouchers = require('../controllers/vouchersController')

router.get('/buscar', auth, cVouchers.renderSearchView)

router.get('/registrar', auth, cVouchers.renderRegisterView)

router.get('/editar', auth, cVouchers.renderEditView)

router.get("/size", auth, cVouchers.numberOfRegisters)

router.get('/search', auth, cVouchers.searchVouchers)

router.post('/register', auth, cVouchers.registerVoucher)

router.get('/get/table/:table/voucher/:folio', auth, cVouchers.getUniqueVoucher)

router.put('/edit/:folio', auth, cVouchers.editVoucher)

router.delete('/delete', auth, cVouchers.deleteVoucher)

module.exports = router