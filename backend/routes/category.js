import express from 'express'
const route = express.Router()

import {
    addCategory,
    fetchListCategory,
    fetchCategory,
    fetchCategorybyId,
    updateCategory,
    updateCategoryActive,
    deleteCategory
} from '../controllers/category.js'

route.post('/add', addCategory)
route.get('/list', fetchListCategory)
route.get('/', fetchCategory)
route.get('/:id', fetchCategorybyId)
route.put('/:id', updateCategory)
route.put('/:id/active', updateCategoryActive)
route.delete('/delete/:id', deleteCategory)

export default route