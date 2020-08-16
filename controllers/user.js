const User = require('../models/user')
const Orders = require('../models/order');

exports.getUserById = (req,res,next,id) => {
    User.findById(id).exec((err, user) => {
        if(err || !user){
            return res.status(400).json({
                error: "No user found in DB"
            })
        }
        req.profile= user;
        next();
    });
}

exports.getUser = (req, res) => {
    req.profile.salt = undefined;
    req.profile.encryptedPassword= undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt= undefined;
    return res.json(req.profile)
}

/* Assignment: getAllUsers
exports.getUsers = (req, res) => {
    User.find().exec((err, users) => {
        if(err || !users){
            return res.status(400).json({
                error: "No user found in DB"
            })
        }
    res.json(users)
     });
} */ 

exports.updateUser = (req, res) => {
    User.findByIdAndUpdate(
        {_id : req.profile._id},
        {$set: req.body},
        {new: true , useFindAndModify: false},
        (err, user) => {
            if(err || !user){
                res.status(400).json({
                    error: "You're not authorised to update this info"
                })
            }
            user.salt = undefined;
            user.encryptedPassword= undefined;
            user.createdAt = undefined;
            user.updatedAt= undefined;
            res.json(user)
        });
}

exports.pushOrderPurchaseList = (req, res, next) => {
    let purchases = []
    req.body.order.products.forEach(product => {
        purchases.push({
            id: product._id,
            name: product.name,
            description: product.description,
            category:product.category,
            quanity: product.quanity,
            amount: req.body.order.amount,
            transactionId: req.body.order.transactionId
        });
    });
    // Store this in DB

    User.findOneAndUpdate(
        {_id: req.profile._id},
        {$push: {purchases: purchases}},
        {new: true},
        (err, purchases) => {
            if(err || !purchases){
                return res.status(400).json({
                    error: "Unable to save purchase list"
                })
            }
            next();
            // nothing to return, if it doesn't fail
        }
    );
};

exports.userPurchaseList = (req, res) => {
    Orders.find({user: req.profile._id})
    .populate("user", "_id firstName")
    .exec((err, order) => {
        if(err || !order){
            return res.status(400).json({
                error: "No order in this acc"
            })
        }
        return res.json(order)
    })
}