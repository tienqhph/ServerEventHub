const userModel = require("../model/userModel");
const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer')
const jwt = require("jsonwebtoken");

require('dotenv').config()

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, 
  secure: true,
  auth: {
    user: 'hoangtienlop11a2@gmail.com',
    pass: 'wywqvfluccqommec',
  },
});

const hanldeSendtOtp = async  (val , email) =>{


try {
   await transporter.sendMail({
    from: `Suport EventHub Application ${process.env.USERNAME_APPLICATION}`, // sender address
    to: email, // list of receivers
    subject: "Verification email code", // Subject line
    text: "Your code verification email", // plain text body
    html: `<h1>${val}</h1>`, // html body
  });
} catch (error) {
    console.log(error)
}

}
const verification = async(req , res)=>{
    const {email} = req.body 
      const verificationCode = Math.round(1000+Math.random()*9000)
    console.log(verificationCode)
      await hanldeSendtOtp( verificationCode, email )

      res.status(200).send({
        message:'Send Verification code sucsessfully' ,
        data:{
          code:verificationCode
        }
      })
}
//tạo json web token
const CreateJwt = async (email, id) => {
  const payload = {
    email,
    id,
  };
  const token = await jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });

  return token;
};

const resgiter = async (req, res) => {
  const { email, fullname, passworrd } = req.body;

  console.log(email , fullname , passworrd)
  const existingEmail = await userModel.findOne({ email });

  if (existingEmail) {
    res.status(400).json({
      message: "email already has exist",
    });
  } else {
    ///mã hóa password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(passworrd, salt);

    const user = new userModel({
      email,
      passworrd: hash,
      fullname: fullname ?? "",
    });
    await user.save();

    res.status(200).json({
      message: "Regiter sucssesfuly",
      data: {
        email: user.email,
        id: user.id,
        token: await CreateJwt(email, user.id),
      },
    });
  }
};

const login = async (req, res) => {
  const { email, passworrd } = req.body;

  console.log(email)
  const findemail = await userModel.findOne({ email });
 try {

  if (!findemail) {
    res.status(403).json({
      
        messgae: "User Not Found!!!",
      }
    )
  }
  //kiểm tra password có đúng chưa
  const isMatchPassWord = await bcrypt.compare(passworrd, findemail.passworrd);

  if (!isMatchPassWord) {
    return res.status(401).json({ error: "No Profile Found" });

  }

 } catch (error) {
    console.log(error)
 }
  res.status(200).json({
    message: "Regiter sucssesfuly",
    data: {
      email: findemail.email,
      id: findemail.id,
      token: await CreateJwt(email, findemail.id),
    },
  });
};

module.exports = { resgiter, login  ,verification};
