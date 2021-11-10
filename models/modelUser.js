const db = require('../database/Connection')
const jwt = require('jsonwebtoken');
const by = require('bcrypt');

function login(user) {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM users WHERE email = ? LIMIT 1", [user.email], (err, results) => {
            if (err) {
                console.log(err);
                reject({ url: `/error/500?error=${err.sqlMessage}` })
            } else {
                if (results.length > 0) {
                    by.compare(user.pass, results[0].pass, (err, value) => {
                        if (!err) {
                            if (value) {
                                //crea el usuario y genera el token si devuelve el callback true
                                let user = {
                                    id_user: results[0].id_user,
                                    name: results[0].name,
                                    email: results[0].email,
                                    pass: results[0].pass
                                }

                                jwt.sign({ user: user }, "secretKey", (err, token) => {
                                    if (err) {
                                        reject({ url: `/error/500?error=${err}` })
                                    } else {
                                        delete user.pass
                                        db.query("UPDATE users SET token = ? WHERE id_user = ?", [token, user.id_user], (errorSql, resultsSql) => {
                                            if (errorSql) {
                                                console.log(errorSql)
                                                reject({ url: `/error/500?error=${err}` })
                                            } else {
                                                user.token = token
                                                user.url = "http://localhost:5000/dashboard"
                                                resolve(user)
                                            }
                                        })

                                    }
                                })
                            } else {
                                //devuelve el error de contraseña no compatible 
                                reject({ url: `/?err=PasswordIncorrect&email=${user.email}` })
                            }
                        } else {
                            reject({ url: '/error/500' })
                        }

                    })
                } else {
                    //devuelve error de usuario no encontrado
                    reject({ url: '/?err=noFound' })
                }
            }
        })
    })
}

function registerUser(user) {
    return new Promise((resolve, reject) => {
        db.query("INSERT INTO `users` SET ? ", [user], (err, results, fields) => {
            if (err) {
                console.log(err);
                reject({ url: `/error/500?error=${err.sqlMessage}` })
            } else {
                resolve({ url: `/?user=1&email=${user.email}` })
            }
        });
    })
}

function getToken(id_user) {
    return new Promise((resolve, reject) => {
        db.query("SELECT token FROM users WHERE id_user = ? LIMIT 1", [id_user], (error, results) => {
            if (error) {
                console.log(error)
                reject({ url: `/error/500?error=${err.sqlMessage}` })
            } else {
                console.log(results)
                resolve(results[0].token)
            }
        })

    })
}

module.exports = {
    login,
    registerUser,
    getToken
}