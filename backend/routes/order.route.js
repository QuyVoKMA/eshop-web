import express from 'express';
import { createOrder, deleteOrder, getbyidOrder, getCountOrder, getOrders, getTotalsalesOrder, getUserOrder, updateOrder } from '../controllers/orders.controller.js';
const route = express.Router()

route.post('/', createOrder)
route.get('/', getOrders)
route.get('/:id', getbyidOrder)
route.put('/:id', updateOrder)
route.delete('/:id', deleteOrder)
route.get('/get/totalsales', getTotalsalesOrder)
route.get('/get/count', getCountOrder)
route.get('/get/userorders/:userid', getUserOrder)


export default route