import express from 'express';
import { deleteCategory, getbyidCategory, getCategorys, postCategory, updateCategory } from '../controllers/category.controller.js';

const route = express.Router();

route.post('/', postCategory);
route.get('/', getCategorys);
route.delete('/:id', deleteCategory)
route.get('/:id', getbyidCategory)
route.put('/:id', updateCategory)



export default route;