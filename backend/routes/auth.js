import express from "express";
import {login,
        register,
        registerAdmin,
        forgot,
       resetToken, 
       reset, 
       getGoogle, 
       getFacebook, 
       getFacebookCallback, 
       getGoogleCallback} from '../controllers/auth.js'
const route = express.Router()

route.post('/login', login)
route.post('/register',register)
route.post('/register-admin',registerAdmin)
route.post('/forgot',forgot)
route.post('/reset/:token',resetToken)
route.post('/reset',reset)
route.get('/google',getGoogle)
route.get('/google/callback',getGoogleCallback)
route.get('/facebook',getFacebook)
route.get('/facebook/callback',getFacebookCallback)

export default route            