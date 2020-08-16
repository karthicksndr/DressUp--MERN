const { Router } = require("express");
const {signOut,signup,signin, isSignedIn} = require("../controllers/auth")
const { check, validationResult } = require('express-validator');

var express = require('express')
var router = express.Router()

router.post("/signup", [
    check('email',"enter a valid email").isEmail(),
    check('password',"min length is 5").isLength({min: 5}) 
  ], signup)

  router.post("/signin", [
    check('email',"enter a valid email").isEmail(),
    check('password',"password incorrect").isLength({min: 3}) 
  ], signin)

router.get("/signout", signOut)

router.get("/testRoute", isSignedIn, (req, res) => {
    res.json(req.auth)
})

module.exports = router;