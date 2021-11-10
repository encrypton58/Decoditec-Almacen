const mysql = require('mysql');
require('dotenv').config()

const cred = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DB_USAGE
}

const conection = mysql.createPool(cred)

conection.getConnection((err) => {
    if (err) {
        console.log(err)
    } else {
        console.log("Good Config db")
    }
})

module.exports = conection