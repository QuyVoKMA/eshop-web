import express from 'express'
import {
    addMerchant,
    searchMerchant,
    fetchAllMerchant,
    disableMerchantAccount,
    approveMerchant,
    rejectMerchant,
    signupMerchant,
    deleteMerchant,
} from '../controllers/merchant.js'

const route = express.Router()

route.post('/add', addMerchant)
route.get('/search', searchMerchant)
route.get('/',fetchAllMerchant )
route.put('/:id/active', disableMerchantAccount)
route.put('/approve/:id', approveMerchant)
route.put('/reject/:id', rejectMerchant)
route.post('/signup/:token', signupMerchant)
route.delete('/delete/:id', deleteMerchant)

export default route