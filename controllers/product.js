const Product = require('../models/product')
const formidable = require("formidable")
const _  = require("lodash")
const fs = require("fs")
const { sortBy } = require('lodash')


exports.getProductById = (req, res , next, id) => {
    Product.findById(id)
    .populate("category")
    .exec( (err, product)=> {
        if(err){
            return res.status(400).json({
                error: "Product not found"
            })
        }
        req.product = product;
        next();
    } )  
}


exports.createProduct = (req, res) => { 
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error: "Problem with the uploaded image"
            });
        }

        // destructure the fields

        const {name, description, price, category, stock} = fields;

        if( !name || !description || !price || !category || !stock){
            return res.status(400).json({
                error: "Please include all mandatory fields"
            })
        }
        
        let product= new Product(fields)
        // handle files 
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error: "Image size is too large"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType= file.photo.type
        }

        //save to the DB

        product.save((err, product) => {
            if(err){
                return res.status(400).json({
                    error: "Saving tshirt in DB failed"
                })
            }
            res.json(product);
        })
    });
};

exports.getProduct = (req, res) => {
    req.product.photo = undefined
    return res.json(req.product)
}

exports.photo = (req, res, next) => {        // middleware
    if(req.product.photo.data){
        res.set("Content-Type", req.product.photo.contentType)
        return res.send(req.product.phooto.data)    
    }
    next(); 
}

exports.removeProduct = (req, res) => {
    const product = req.product

    product.remove((err, deletedProduct) => {
        if(err){
            return res.status(400).json({
                error: "Failed to delete the product"
            })
        }
        res.json({
            message: `Successfully deleted product - ${deletedProduct.name}`
        });
    });
}

exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error: "Problem with the uploaded image"
            });
        }
        
        // updating the product details
        let product= req.product;
        product = _.extend(product, fields)

        // handle files 
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error: "Image size is too large"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType= file.photo.type
        }

        //save to the DB

        product.save((err, product) => {
            if(err){
                return res.status(400).json({
                    error: "Update of tshirt in DB failed"
                })
            }
            res.json(product);
        })
    });
};

exports.getAllProducts = (req, res) => {
    let limit= req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy= req.query.sortBy ? req.query.sortBy  : "_id";
    Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc", ]])
    .limit(limit)
    .exec((err, products) => {
        if(err) {
            res.status(400).json({
                error: "Unable to retrieve products"
            })
        }
        res.json(products)
    });
};