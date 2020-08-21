const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const router = express.Router();
const UsersModel = require('../models/users')
const {isAuthenticated} = require('../auth/index');

const signToken = (_id) =>{
    return jwt.sign({_id}, 'my-secret', {
        expiresIn: 60 * 60 * 24 * 365,
    });
}

//register
router.post('/register', (req, res)=>{
    const {email, password} = req.body;
    crypto.randomBytes(16, (err, salt) =>{
        const newSalt = salt.toString('base64');
        crypto.pbkdf2( password, newSalt, 10000, 64, 'sha1', (err, key) => {
           const encryptedPasswd = key.toString('base64');
           UsersModel.findOne({email}).exec()
               .then(user => {
                  if(user){
                      return res.send('User already exists!');
                  }
                  UsersModel.create({
                      email,
                      password: encryptedPasswd,
                      salt: newSalt,
                  }).then(()=>{
                      res.send('User created!');
                  });
               });
        });
    });
})

//login
router.post('/login', (req, res)=>{
    const {email, password} = req.body;
    UsersModel.findOne({email}).exec()
        .then(user =>{
            if(!user){
                return  res.send('Incorrect user and/or password!!!');
            }
            crypto.pbkdf2( password, user.salt, 10000, 64, 'sha1', (err, key) => {
                const encryptedPasswd = key.toString('base64');
                if(user.password === encryptedPasswd){
                    const token = signToken(user._id);
                    return res.send({token});
                }
                return res.send('Incorrect user and/or password');
            });
        })
})

router.get('/me', isAuthenticated, (req, res) => {
    res.send(req.user);
});

module.exports = router;