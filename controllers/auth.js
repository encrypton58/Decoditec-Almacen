const { getToken } = require('../models/modelUser')

const auth = function(req, res, next) {
    if (req.session.user) {
        getToken(req.session.user.id_user).then(token => {
            if (req.session && req.session.user.token == token)
                return next();
            else
                return res.redirect('/')
        }).catch((value) => {
            return res.redirect('/')
        })
    } else {
        return res.redirect('/')
    }
};

module.exports = auth