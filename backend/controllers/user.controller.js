import userModel from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config();

export const getUsers = async (req, res)=>{
    const userList = await userModel.find().select('-passwordHash');

    if(!userList){
        res.status(500).json({success: false})
    }
    res.status(200).send(userList)
}
export const getbyidUser = async (req, res)=>{
    const user = await userModel.findById(req.params.id).select('-passwordHash')    ;

    if(!user){
        res.status(500).json({message: "The user with the given ID was not found!"})
    }
    res.status(200).send(user)
}


export const postUser = async (req, res) =>{
    let user = new userModel({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcryptjs.hashSync(req.body.password, 10) ,
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })
    user = await user.save()
    if(!user){
        return res.status(400).send('The user cannot be created!')
    }
    res.status(200).send(user)
}

export const login = async (req, res) =>{
    const user = await userModel.findOne({email: req.body.email})

    const secret = process.env.secret
    if(!user){
       return res.status(400).send('The user not found!')
    }
    if(user && bcryptjs.compareSync(req.body.password, user.passwordHash)){
        const token = jwt.sign(
            {
            userId: user.id,
            isAdmin: user.isAdmin
            },
        secret,
        {expiresIn: '1d'}
        )
        
        res.status(200).send({user: user.email, token: token})
    }else{
        res.status(400).send('password is wrong!');
    }
    
}


