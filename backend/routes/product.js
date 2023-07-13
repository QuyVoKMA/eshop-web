import express from 'express'
const route = express.Router()

import {
    fetchProductslug,
    fetchProductSearch,
    fetchStoreProductbyAdvancedFilter,
    fetchStoreProductbyBrand,
    fetchListProductSelect,
    addProduct,
    fetchProduct,
    fetchProductById,
    updateProduct,
    updateProductActive,
    deleteProduct
} from '../controllers/product.js'

route.get('/item/:slug', fetchProductslug)
route.get('/list/search/:name', fetchProductSearch)
route.get('/list', fetchStoreProductbyAdvancedFilter)
route.get('/list/brand/:slug', fetchStoreProductbyBrand)
route.get('/list/select', fetchListProductSelect)
route.post('/add', addProduct)
route.get('/', fetchProduct)
route.get('/:id', fetchProductById)
route.put('/:id', updateProduct)
route.put('/:id/active', updateProductActive)
route.delete('/delete/:id', deleteProduct)

export default route