import express from 'express'
const route = express.Router()
import {search, fetch,fetchUsers, updateUser} from '../controllers/user.js'

route.get('/search', search)
route.get('/', fetchUsers)
route.get('/me', fetch)
route.put('/', updateUser)

export default route