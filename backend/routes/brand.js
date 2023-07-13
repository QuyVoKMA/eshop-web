import express from 'express'
const route = express.Router()
// import {auth} from '../middlewares/auth.js'
import {check} from '../middlewares/role.js'
import { ROLES } from '../constants/index.js'
import {
    addBrand,
    fetchBands,
    fetchListBrandSelect,
    fetchStoreBrandList,
    fetchBrandById,
    updateBrand,
    updateBrandActive,
    deleteBrand
} from '../controllers/brand.js'


route.post('/add' ,addBrand)
route.get('/list', fetchStoreBrandList)
route.get('/', fetchBands)
route.get('/:id', fetchBrandById) 
route.get('/list/select', fetchListBrandSelect) //chua lam
route.put('/:id', updateBrand)
route.put('/:id/active', updateBrandActive)
route.delete('/delete/:id', deleteBrand)

export default route