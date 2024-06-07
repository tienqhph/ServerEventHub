const userModel = require("../model/userModel");
const bcrypt = require("bcryptjs");

const jwt = require('jsonwebtoken')

//tạo json web token
const  CreateJwt = async(email , id)=>{
  const payload = {
    email , id
  }
  const token = await jwt.sign(payload ,process.env.SECRET_KEY , {
    expiresIn:'7d'
  })

  return token

}

const resgiter = async (req, res) => {
  const { email, fullname, passworrd } = req.body;
  const existingEmail = await userModel.findOne({ email });

 
  if (existingEmail) {
   res.status(400).json({
    message:'email already has exist' , 
   })

  } else {
    ///mã hóa password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(passworrd, salt);


    const user = new userModel({
      email,
      passworrd:hash,
      fullname: fullname ?? "",
    });
    await user.save();

    res.status(200).json({
        message:'Regiter sucssesfuly' , 
        data:{
          ...user  , 
          token: await CreateJwt(email , user.id)
        }
    })
  }
};

module.exports = { resgiter };
