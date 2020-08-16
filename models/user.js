
var mongoose = require('mongoose');
const crypto = require('crypto');
const uuidv1= require('uuid/v1')

  var userSchema = new mongoose.Schema({
   firstName: {
       type: String,
       required: true,
       maxlength: 32,
       trim: true
   },
   lastName : {
        type: String, 
        required: false,
        maxlength: 32,
        trim: true
   },
   email: {
       type: String,
       trim: true,
       required: true,
       unique: true
   },
   userInfo : {
       type: String,
       trim: true
   },
   //TODO: revisit
   encryptedPassword: {
       type:String,
       required:true
   },
   salt: String,
   role: {
       type: Number,
       default: 0
   },
   purchases: {
       type: Array,
       default: []
   }
  },
    {timestamps: true});

  userSchema.virtual("password")
    .set(function(password){
        this._password= password
        this.salt = uuidv1();
        this.encryptedPassword = this.encryptPassword(password)
    })
    .get(function (){
        return this._password;
    })

  userSchema.methods = {

    authenticate : function(plainPassword){
        return this.encryptPassword(plainPassword) === this.encryptedPassword
    },
      encryptPassword: function(plainPassword){
          if(!plainPassword) return "";
          try {
              return crypto.createHmac('sha256', this.salt)
              .update(plainPassword)
              .digest('hex');
          }catch (err){
              return "";
          }
      }
  }

  module.exports = mongoose.model("User",userSchema)