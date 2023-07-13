import express from 'express'
const route = express.Router()

import {
    addOrder,
    searchOrder,
    fetchOrder,
    fetchOrderId,
    fetchmyOrder,
    deleteOrder,
    updateOrder
} from '../controllers/order.js'

route.post('/add', addOrder)
route.get('/search', searchOrder)
route.get('/', fetchOrder)
route.get('/me', fetchmyOrder)
route.get('/:orderId', fetchOrderId)
route.delete('/cancel/:orderId', deleteOrder)
route.put('/status/item/:itemId', updateOrder)

export default route