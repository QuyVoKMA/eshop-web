import express from 'express'
const route = express.Router()

import {
    addContact
} from '../controllers/contact.js'

route.post('/add', addContact)

export default route