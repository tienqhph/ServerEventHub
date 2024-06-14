const { default: mongoose } = require("mongoose");

const userSchame =new mongoose.Schema({
    name:{
        type:String
    } , 
    photo:{
        type:String
    },
    givenName:{
        type:String
    },
    familyName:{
        type:String
    },
    email:{
        type:String , 
        require:true
    }, 
    passworrd:{
        type:String , 
        require:true
    } , 
    isUpdated:{
        type:Boolean
    },

    photoUrl:{
        type :String 
    },
    createdAt:{
        type:Date , 
        default:Date.now()
    } , 
    updatedAt:{
        type:Date , 
        default:Date.now()
    }

 
})


const userModel = mongoose.model('users' , userSchame)


module.exports = userModel