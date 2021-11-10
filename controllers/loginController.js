const modelUser = require('../models/modelUser')
const User = require('../util/User')
const by = require('bcrypt')

function loginUser(req, res) {
    let email = req.body.email
    let pass = req.body.pass
    console.log(req.body)
    if (email && pass) {
        const user = new User(email, pass)
        modelUser.login(user).then((data) => {
            let url = data.url
            delete data.url
            req.session.user = data
            res.redirect(url)
        }).catch(url => {
            res.redirect(url.url)
        })
    } else {
        res.redirect('/?err=NoDataFull')
    }
}

function registerUser(req, res) {
    let name = req.body.name
    let email = req.body.email
    let pass = req.body.pass
    if (name && email && pass) {
        email = escapeRegExp(email.trim())
        pass = by.hashSync(pass, 8);
        let user = new User(email, pass)
        user.name = name
        user.id_user = 0
        user.name = escapeRegExp(user.name.trim())
        modelUser.registerUser(user)
            .then(data => res.redirect(data.url))
            .catch(url => res.redirect(url.url))
    } else {
        res.redirect("/user/registerform?err=NoDataFull")
    }

}

function escapeRegExp(text) {
    return text.replace(/[-[\]{}()*+?,<>/^$|#]/g, '\\$&');
}

module.exports = {
    loginUser,
    registerUser
}