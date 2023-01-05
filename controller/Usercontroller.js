const { User, Uservalidate, UserSchema } = require("../models/user");
const Otp = require("../models/otp");

const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { random, result } = require("lodash");

//Register API for User
module.exports.Userregister = async (req, res) => {
  try {
    const { error } = Uservalidate(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });

    if (user) return res.status(400).json("User already Registered");

    const phone = await User.findOne({ phone: req.body.phone });
    if (phone)
      return res
        .status(200)
        .json(
          "User already Register with this Phone Number--(please use another Phone Number)"
        );

    user = new User(
      _.pick(req.body, [
        "firstname",
        "lastname",
        "email",
        "phone",
        "password",
        "confirmPassword",
      ])
    );

    const pass = req.body.password === req.body.confirmPassword;
    if (!pass) return res.status(200).json("password not match");

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    user.confirmPassword = await bcrypt.hash(req.body.confirmPassword, salt);
    await user.save();
    const token = await user.genAuthToken();
    const { password, ...others } = user._doc;
    res.status(200).json({ ...others, token });
  } catch (error) {
    console.log(error.message);
  }
};

// Login API for User
function validateLogin(data) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(30).lowercase().required().email(),
    password: Joi.string().min(5).required(),
  });
  return schema.validate(data);
}

module.exports.Userlogin = async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });

    if (!user) res.status(400).json("Please Enter Valid Username");

    const validpass = await bcrypt.compare(req.body.password, user.password);
    if (!validpass) return res.status(401).json("Please Enter Valid Password");

    const token = await user.genAuthToken();
    const { password, ...others } = user._doc;
    res.status(200).json({ ...others, token });
  } catch (error) {
    console.log(error.message);
  }
};

//mail send via email

function validateEmailSend(data) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(30).email().required(),
  });
  return schema.validate(data);
}

module.exports.emailSend = async (req, res) => {
  try {
    const { error } = validateEmailSend(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let data = await User.findOne({ email: req.body.email });
    const responseType = {};
    if (data) {
      let otpcode = Math.floor(Math.random() * 99999 + 1);
      let otpData = new Otp({
        email: req.body.email,
        otp: otpcode,
        expireIn: new Date().getTime() + 300 * 1000,
      });
      let otpResponse = await otpData.save();
      mailer(otpcode);
      responseType.statusText = "Success";
      responseType.message = "Please check your email Box";
    } else {
      responseType.statusText = "error";
      responseType.message = "Email id not exists";
    }
    res.status(200).json(responseType);
  } catch (error) {
    console.log(error.message);
  }
};
//email sender
const mailer = (email, subject, text) => {
  try {
    var nodemailer = require("nodemailer");
    var transporter = nodemailer.createTransport({
      host: process.env.Host,
      service: process.env.SERVICE,
      port: 587,
      secure: true,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    var mailOptions = {
      from: process.env.USER,
      to: email,
      subject: subject,
      text: text,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
      } else {
        console.log("Email-Sent", info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

//forget password for User API

function validateforgetpassword(data) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(30).lowercase().email().required(),
    otp: Joi.string().required(),
    password: Joi.string().min(5).required(),
    confirmPassword: Joi.string().min(5).required(),
  });
  return schema.validate(data);
}

module.exports.forgetPassword = async (req, res) => {
  try {
    const { error } = validateforgetpassword(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let data = await Otp.findOne({ email: req.body.email, otp: req.body.otp });
    const response = {};
    if (data) {
      let currentTime = new Date().getTime();
      let diff = data.expireIn - currentTime;
      if (diff < 0) {
        response.message = "Token Expire";
        response.statusText = "Success";
      } else {
        let user = await User.findOne({ email: req.body.email });
        user.password = req.body.password;
        user.confirmPassword = req.body.confirmPassword;

        const pass = req.body.password === req.body.confirmPassword;
        if (!pass) return res.status(200).json("password not match");

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        user.confirmPassword = await bcrypt.hash(
          req.body.confirmPassword,
          salt
        );
        user.save();
        response.message = "password created successfully";
        response.statusText = "Success";
      }
    } else {
      response.message = "Invalid Otp";
      response.statusText = "Success";
    }
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

//user update details

function UserUpdate(data) {
  const schema = Joi.object({
    firstname: Joi.string().min(5).max(30),
    lastname: Joi.string().min(5).max(30),
    email: Joi.string().min(5).max(30).lowercase().email(),
    phone: Joi.string(),
  });
  return schema.validate(data);
}
module.exports.updateUser = async (req, res) => {
  try {
    const { error } = UserUpdate(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    let user = await User.findOneAndUpdate(
      req.user,
      { $set: req.body },
      { new: true }
    );
    if (!user) return res.status(404).json("user token not found");

    res.status(200).json("user  details  update Successfully");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

//reset-password

function resetpass(data) {
  const schema = Joi.object({
    oldpassword: Joi.string().min(5).required(),
    newpassword: Joi.string().min(5).required(),
    confirmPassword: Joi.string().min(5).required(),
  });
  return schema.validate(data);
}

module.exports.resetpassword = async (req, res) => {
  try {
    const { error } = resetpass(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    let user = await User.findOne(req.user);
    if (!user) return res.status(404).json("user token  not found");

    const pass = req.body.newpassword === req.body.confirmPassword;
    if (!pass) return res.status(200).json("password not match");

    const validpass = await bcrypt.compare(req.body.oldpassword, user.password);
    if (!validpass) return res.status(401).json("old password was wrong");

    user = await User.findOneAndUpdate(
      req.user,
      {
        $set: {
          password: req.body.newpassword,
          confirmPassword: req.body.confirmPassword,
        },
      },
      { new: true }
    );

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.newpassword, salt);
    user.confirmPassword = await bcrypt.hash(req.body.confirmPassword, salt);
    await user.save();

    res.status(200).json("password update successfully");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

//delete user
module.exports.deleteUser = async (req, res) => {
  try {
    let user = await User.findOneAndDelete(req.user);
    if (!user) return res.status(404).json("user token not found");

    res.status(200).json("user delete successfully");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

//find unique user
module.exports.FindUser = async (req, res) => {
  try {
    let user = await User.findOne(req.user);
    if (!user) return res.status(404).json("User token Not found");

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

//find all user
module.exports.FindAllUser = async (req, res) => {
  try {
    let user = await User.find();
    if (!user) return res.status(404).json("user token not found");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

//find latest user
module.exports.FindlatestUser = async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(1)
      : await User.find();

    res.status(200).json(users);
  } catch (error) {
    res.status(200).send(error.message);
  }
};
