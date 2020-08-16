const User = require("../models/user")
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

exports.signup = (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).json({
            message: errors.array()[0].msg,
            param: errors.array()[0].param
        })
    }
    const user = new User(req.body);
    user.save((err, user) => {
        if(err)
        {
            return res.status(400).json({
                err: "Not able to save user in db"
            })
        }
        res.json({
            firstName: user.firstName,
            lastName: user.lastName,
            email : user.email,
            password: user.password,
            id: user._id
        });
    })
};

exports.signin = (req, res) => {
    const errors = validationResult(req)
    const {email,password} = req.body;
    
    if(!errors.isEmpty()){
        return res.status(422).json({
            message: errors.array()[0].msg,
            param: errors.array()[0].param
        })
    }
    User.findOne({email},(err,user) => {
        if(err || !user){
            return res.status(400).json({
                error: "User doesn't exist"
            })
        }
        if(!user.authenticate(password)){
            return res.status(401).json({
                error: "Email or password is incorrect"
            })
        }
        // create token using jsonwebtoken
        const token = jwt.sign({ _id: user._id }, process.env.SECRET );
        // put token in cookies
        res.cookie("token", token, {expire: new Date() + 999 });
        // send respond to front-end

        const {_id, firstName, email, role} = user;
        return res.json({token, user: {_id, firstName, email, role}})
    });
};

exports.signOut= (req,res) => {
    res.clearCookie("token")
    res.json({
        message: "user signed out"
    });
}

// protected routes 

exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth"
});

// custom made middlewares

exports.isAuthenticated = (req, res , next) => {
    let checker = req.profile && req.auth && req.profile._id  == req.auth._id;
    if(!checker){
        return res.status(403).json({
            error: "Access denied"
        })
    }
    next();
}

exports.isAdmin = (req, res , next) => {
    if(req.profile.role === 0){
        res.status(404).json({
            error: "You are not an ADMIN"
        })
    }
    next();
}