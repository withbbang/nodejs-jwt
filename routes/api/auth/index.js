const router = require('express').Router()
const controller = require('./controller')

router.post('/register', controller.register)
router.get('/register', controller.getRes)

module.exports = router