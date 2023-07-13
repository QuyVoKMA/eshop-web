import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import passport from 'passport'
// import auth from '../middlewares/auth.js'

import User from '../models/user.js'
import mailgun from '../services/mailgun.js'
import keys from '../config/keys.js'
import {EMAIL_PROVIDER} from '../constants/index.js'


const {secret, tokenLife} = keys.jwt

 export const login = async (req, res) =>{
   try {
    const {email, password} = req.body

    if(!email){
        return res.status(400).json({message:"Error", data:"You must enter an email address."})
    }

    if(!password){
        return res.status(400).json({message:"Error", data:"You must enter a password."})
    }

    const user = await User.findOne({email})
    if(!user){
        return res.status(400).json({message:"Error", data:"No user found for this email address."})
    }

    if(user && user.provider !== EMAIL_PROVIDER.Email){
        return res.status(400).json({message:"Error", data:`That email address is already in use using ${user.provider} provider.`})
    }

    const isComparePassword = await bcrypt.compare(password, user.password)
    if(!isComparePassword){
        return res.status(400).json({message:"Fail", data:"Password Incorrect"})
    }

    const payload = {
        id: user.id
    }

    const token = jwt.sign(payload, secret, {expiresIn: tokenLife})
    if(!token){
        throw new Error()
        // return res.status(400).json({message:"Error", data:"token error"})
    }

    res.status(200).json({
        message: "success",
        token: `Bearer ${token}`,
        user:{
            id: user.id,
            fistName: user.fistName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        }
    })

   }catch(error){
    console.log(error)
    return res.status(400).json({message: error, data:"Your request could not be processed. Please try again."})
   } 
 }
 export const registerAdmin = async (req, res) =>{
  try{
      const {email, firstName, lastName, password, role } = req.body
     
      if(!email){
          return res.status(400).json({message:"Error", data:"You must enter an email address."})
      }
      if(!firstName || !lastName){
          return res.status(400).json({message:"Error", data:"You must enter your full name."})
      }
      if(!password){
          return res.status(400).json({message:"Error", data:"You must enter a password."})
      }
      const existingUser = await User.findOne({email})
      if(existingUser){
          return res.status(400).json({message:"Error", data:"That email address is already in use."})
      }
      const user = new User({
          email,
          password,
          firstName,
          lastName,
          role
      })
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(user.password, salt)
      user.password = hash
      const registeredUser = await user.save()
      const payload = {
          id: registeredUser.id
      }
      const token = jwt.sign(payload, secret, {expiresIn: tokenLife})
      res.status(200).json({
          success: true,
          token: `Bearer ${token}`,
          user:{
              id: registeredUser.id,
              firstName: registeredUser.firstName,
              lastName: registeredUser.lastName,
              email: registeredUser.email,
              role: registeredUser.role,
          }
      })
  }catch(error){
    console.log(error)
      // return res.status(400).json({message: error, data:"Your request could not be processed. Please try again."})
  }
}
 export const register = async (req, res) =>{
    try{
        const {email, firstName, lastName, password } = req.body
       
        if(!email){
            return res.status(400).json({message:"Error", data:"You must enter an email address."})
        }
        if(!firstName || !lastName){
            return res.status(400).json({message:"Error", data:"You must enter your full name."})
        }
        if(!password){
            return res.status(400).json({message:"Error", data:"You must enter a password."})
        }
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({message:"Error", data:"That email address is already in use."})
        }
        const user = new User({
            email,
            password,
            firstName,
            lastName,
        })
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(user.password, salt)
        user.password = hash
        const registeredUser = await user.save()
        const payload = {
            id: registeredUser.id
        }
        const token = jwt.sign(payload, secret, {expiresIn: tokenLife})
        res.status(200).json({
            success: true,
            token: `Bearer ${token}`,
            user:{
                id: registeredUser.id,
                firstName: registeredUser.firstName,
                lastName: registeredUser.lastName,
                email: registeredUser.email,
                role: registeredUser.role,
            }
        })
    }catch(error){
      console.log(error)
        // return res.status(400).json({message: error, data:"Your request could not be processed. Please try again."})
    }
 }

 export const forgot = async (req, res) =>{

try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ error: 'You must enter an email address.' });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res
        .status(400)
        .send({ error: 'No user found for this email address.' });
    }

    const buffer = crypto.randomBytes(48);
    const resetToken = buffer.toString('hex');

    existingUser.resetPasswordToken = resetToken;
    existingUser.resetPasswordExpires = Date.now() + 3600000;

    existingUser.save();

    await mailgun.sendEmail(
      existingUser.email,
      'reset',
      req.headers.host,
      resetToken
    );

    res.status(200).json({
      success: true,
      message: 'Please check your email for the link to reset your password.'
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
 }

 export const resetToken = async (req, res) =>{
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'You must enter a password.' });
    }

    const resetUser = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!resetUser) {
      return res.status(400).json({
        error:
          'Your token has expired. Please attempt to reset your password again.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    resetUser.password = hash;
    resetUser.resetPasswordToken = undefined;
    resetUser.resetPasswordExpires = undefined;

    resetUser.save();

    await mailgun.sendEmail(resetUser.email, 'reset-confirmation');

    res.status(200).json({
      success: true,
      message:
        'Password changed successfully. Please login with your new password.'
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }

 }

 export const reset = async (req, res) =>{
  try {
    const { password, confirmPassword } = req.body;
    const email = req.user.email;

    if (!email) {
      return res.status(401).send('Unauthenticated');
    }

    if (!password) {
      return res.status(400).json({ error: 'You must enter a password.' });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res
        .status(400)
        .json({ error: 'That email address is already in use.' });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ error: 'Please enter your correct old password.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(confirmPassword, salt);
    existingUser.password = hash;
    existingUser.save();

    await mailgun.sendEmail(existingUser.email, 'reset-confirmation');

    res.status(200).json({
      success: true,
      message:
        'Password changed successfully. Please login with your new password.'
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }

 }

 export const getGoogle = async (req, res) =>{
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email'],
    accessType: 'offline',
    approvalPrompt: 'force'
  })
 }

 export const getGoogleCallback = async (req, res) =>{
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false
  }),
  (req, res) => {
    const payload = {
      id: req.user.id
    };

    jwt.sign(payload, secret, { expiresIn: tokenLife }, (err, token) => {
      const jwtToken = `Bearer ${token}`;

      const htmlWithEmbeddedJWT = `
    <html>
      <script>
        window.localStorage.setItem('token', '${jwtToken}');
        window.location.href = '/auth/success';
      </script>
    </html>       
    `;

      res.send(htmlWithEmbeddedJWT);
    });
  }
 }

 export const getFacebook = async (req, res) =>{
  passport.authenticate('facebook', {
    session: false,
    scope: ['public_profile', 'email']
  })
 }

 export const getFacebookCallback = async (req, res) =>{
  passport.authenticate('facebook', {
    failureRedirect: '/',
    session: false
  }),
  (req, res) => {
    const payload = {
      id: req.user.id
    };

    jwt.sign(payload, secret, { expiresIn: tokenLife }, (err, token) => {
      const jwtToken = `Bearer ${token}`;

      const htmlWithEmbeddedJWT = `
    <html>
      <script>
        window.localStorage.setItem('token', '${jwtToken}');
        window.location.href = '/auth/success';
      </script>
    </html>       
    `;

      res.send(htmlWithEmbeddedJWT);
    });
  }
 }
