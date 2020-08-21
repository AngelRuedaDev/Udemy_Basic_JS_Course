const jwt = require('jsonwebtoken');
const UsersModel = require('../models/users')

//Adjunta el usuario al objecto si el usuario esta verificado
const isAuthenticated = (req, res, next) =>{
    const token = req.headers.authorization
    if(!token){
       return res.sendStatus(403);
    }

    jwt.verify(token, 'my-secret', (err, decoded)=>{
        const {_id} = decoded;

        UsersModel.findOne({_id}).exec()
            .then(user => {
               req.user = user;
                next();
            });
    });
}

//comprueba el rol del usuario si no es el rol requerido deniega la llamada
const hasRoles = roles = (req, res, next) =>{
    if(roles.indexOf(req.user.role) > -1){
        return next();
    }
    res.sendStatus(403)
}

module.exports = {
    isAuthenticated,
    hasRoles,
}

