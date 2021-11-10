var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
const session = require('express-session')

const indexRouter = require('./routes/index')
const loginIndex = require('./routes/login')
const errorSend = require('./routes/httpCode')
const vouchersRouter = require('./routes/vouchers')

var app = express()

app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret: "i am the number 1 developer i know",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: oneDay }
}))

app.use('/', indexRouter)
app.use('/user', loginIndex)
app.use('/error', errorSend)
app.use('/vales', vouchersRouter)



module.exports = app