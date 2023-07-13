import express from 'express'
const route = express.Router()

import {
    addAddress,
    fetchAddress,
    fetchAddressById,
    updateAddress,
    deleteAddress
} from '../controllers/address.js'

route.post('/add', addAddress)
route.get('/', fetchAddress)
route.get('/:id', fetchAddressById)
route.put('/:id', updateAddress)
route.delete('/delete/:id', deleteAddress)

export default route