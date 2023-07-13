import express from 'express'
const route = express.Router()

import {
    addCart,
    addCartId,
    deleteCart,
    deleteCartProduct
} from '../controllers/cart.js'

route.post('/add', addCart)
route.post('/add/:cartId', addCartId)
route.delete('/delete/:cartId', deleteCart)
route.delete('/delete/:cartId/:productId', deleteCartProduct)

export default route