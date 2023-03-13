import express from 'express';
import { getbyidUser, getUsers, login, postUser } from '../controllers/user.controller.js';


const route = express.Router()

route.post("/register", postUser)
route.get("/", getUsers)
route.get("/:id", getbyidUser)
route.post("/login", login)

export default route    