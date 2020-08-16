const express = require("express")
const router = express.Router();

const {getProductById,createProduct,getProduct,photo,updateProduct,removeProduct,getAllProducts} = require('../controllers/product')
const {isAdmin, isAuthenticated, isSignedIn} = require('../controllers/auth')
const {getUserById} = require('../controllers/user')

// PARAM
router.param("productId" , getProductById);
router.param("userId" ,getUserById);

// ROUTES

router.post("/product/create/:userId", isSignedIn, isAuthenticated, isAdmin, createProduct) // create
router.get("/product/:productId",getProduct)  //read
router.get("/product/photo/:productId", photo) // read
router.put("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, updateProduct)  //update
router.delete("/product/:productId/:userId",isSignedIn, isAuthenticated, isAdmin,removeProduct )  //remove
router.get("/products/", getAllProducts)




module.exports= router;