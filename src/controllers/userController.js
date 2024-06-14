const userModel = require("../model/userModel");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose')
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "hoangtienlop11a2@gmail.com",
    pass: "wywqvfluccqommec",
  },
});
///gửi mã otp
const hanldeSendtOtp = async (val, email) => {
  try {
    await transporter.sendMail({
      from: `Suport EventHub Application ${process.env.USERNAME_APPLICATION}`, // sender address
      to: email, // list of receivers
      subject: "Verification email code", // Subject line
      text: "Your code verification email", // plain text body
      html: `<h1>${val}</h1>`, // html body
    });
  } catch (error) {
    console.log(error);
  }
};
const verification = async (req, res) => {
  const { email } = req.body;
  const verificationCode = Math.round(1000 + Math.random() * 9000);
  console.log(verificationCode);
  await hanldeSendtOtp(verificationCode, email);

  res.status(200).send({
    message: "Send Verification code sucsessfully",
    data: {
      code: verificationCode,
    },
  });
};
//tạo json web token
const CreateJwt = async (email, id ) => {
  const payload = {
    email,
    id,
  };
  const token = await jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });

  return token;
};
//đăng ký account
const resgiter = async (req, res) => {
  const { email, name, passworrd } = req.body;

  console.log(email, name, passworrd);
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
      name:  name?? "",
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
///login
const login = async (req, res) => {
  const { email, passworrd } = req.body;
  const findemail = await userModel.findOne({ email });
  console.log(findemail);
  try {
    if (!findemail) {
      res.status(403).json({
        messgae: "User Not Found!!!",
      });
    }
    //kiểm tra password có đúng chưa
    const isMatchPassWord = await bcrypt.compare(
      passworrd,
      findemail.passworrd
    );

    if (!isMatchPassWord) {
      return res.status(401).json({ error: "No data Found" });
    }
  } catch (error) {
    console.log(error);
  }
  res.status(200).json({
    message: "Regiter sucssesfuly",
    data: {
      email: findemail.email,
      id: findemail.id,
      token: await CreateJwt(email, findemail.id ),
      isUpdated:findemail.isUpdated??false
    },
  });
};

///create new password
const sendNewPassword = async (val, email) => {
  await transporter.sendMail({
    from: `Support EventHub Application ${process.env.USERNAME_APPLICATION}`, // sender address
    to: email, // list of receivers
    subject: "New PassWord", // Subject line
    text: "Your new password ", // plain text body
    html: `<b>${val}</b>`, // html body
  });
};
const generatePassword = (length, characters) => {
  let password = "";
  for (let i = 0; i < length; i++) {
    password += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return password;
};
const resetPassword = async (req, res) => {
  const alpha = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  let characters = alpha;
  characters += numbers;
  const datanewpass = generatePassword(6, characters);
  console.log(datanewpass);
  try {
    const { email } = req.body;
    const existingEmail = await userModel.findOne({ email });
    console.log(existingEmail);
    if (!existingEmail) {
      res.status(401).json({ message: "user not found" });
      throw new NotFoundError("Not found");
    }
    if (datanewpass.length > 0) {
      const salt = bcrypt.genSaltSync(10);
      const hashpassword = await bcrypt.hashSync(datanewpass, salt);
      await userModel.updateOne(
        { email },
        { passworrd: hashpassword, isUpdated: true, updatedAt: new Date() }
      );
      sendNewPassword(datanewpass, email).then(() =>
        res.status(200).json({
          message: "reset pass sucsessfully!!!",
          data: {
            email: existingEmail.email,
          },
        })
      );
    }
  } catch (error) {
    console.log(error);
  }
};



const updateNewPassWord = async(req , res) =>{
    const {  password , newpassword} = req.body
    const {id} = req.params
  console.log(password)
    const existingUser =  await userModel.findById(id);
    if(existingUser){
        const comparePass = await bcrypt.compare(password , existingUser.passworrd )

        console.log(comparePass)
        if(comparePass){
            const salt =  bcrypt.genSaltSync(10)
            const hashpass = await bcrypt.hashSync(newpassword , salt)
            await userModel.findByIdAndUpdate(id,{
              passworrd: hashpass, isUpdated: false, updatedAt: new Date() 
            } ).then(()=>console.log('update sucssefuly'))

            res.status(200).send({
              message: "reset pass sucsessfully!!!",
              data: {
                email: existingUser.email,
                id: existingUser.id,
                password: hashpass,
                token: await CreateJwt(existingUser.email, existingUser.id),
                isUpdated:existingUser.isUpdated??false
              },
            })
        }else{
          res.status(400).json({
            message:'password is correct'
          })
        }
    }else{
      res.status(401).json({
        message:"user not found!!"
      })
    }
}


const hanldeLoginWithGoogle  = async(req , res) =>{
const {userInfor} = req.body

const data = userInfor.user
 const existingUser =  await userModel.findOne({email:userInfor.user.email})
  
  if(existingUser){
    await userModel.findByIdAndUpdate(existingUser.id , {...data})
    console.log("update done")
  }else{
      const newdata = new userModel({
        ...data
      })
      await newdata.save()
      console.log("save sucssesfuly")   
  }
      const datareturn = await userModel.findOne({email:userInfor.user.email})

      res.status(200).json({
        message: "Login sucssesfuly",
        data: {
          email: datareturn.email,
          id: datareturn.id,
          token: await CreateJwt(datareturn.email, datareturn.id ),
          isUpdated:datareturn.isUpdated??false , 
          ...data
        },
      });
}

const handleLoginWithFaceBook = async( req , res)=>{
  const {datauser} = req.body
 const existingUser = await userModel.findOne({email:datauser.userID})
 console.log(existingUser)

 if(!existingUser){
    const newdata =  new userModel({
      name:datauser.name , 
      email:datauser.userID , 
      photo:datauser.imageURL , 
      familyName:datauser.firstName , 
      givenName:datauser.lastName ,
      ...datauser
    })

    await newdata.save()
    console.log("create done")

 }else{
  const dataupdate = {
    name:datauser.name , 
    email:datauser.userID , 
    photo:datauser.imageURL , 
    familyName:datauser.firstName , 
    givenName:datauser.lastName ,
    ...datauser
  }
  await userModel.findByIdAndUpdate(existingUser.id , {...dataupdate})
  console.log("update done")
 }

 const datareturn = await userModel.findOne({email:datauser.userID})

 res.status(200).json({
   message: "Login sucssesfuly",
   data: {
    email: datareturn.email,
    id: datareturn.id,
    token: await CreateJwt(datareturn.email, datareturn.id ),
    isUpdated:datareturn.isUpdated??false , 
    ...datauser 
   },
 });
}
module.exports = { resgiter, login, verification, resetPassword ,updateNewPassWord , hanldeLoginWithGoogle ,handleLoginWithFaceBook}   ;
