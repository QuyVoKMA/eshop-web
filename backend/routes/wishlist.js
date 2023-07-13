import express from 'express'
const route = express.Router()
import {postWishlist, fetchwishlist} from '../controllers/wishlist.js'

route.post('/', postWishlist)
route.get('/', fetchwishlist)

export default route