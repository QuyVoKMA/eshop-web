import passport from 'passport'
import Category from '../models/category.js'
import {disableProducts} from '../utils/store.js'
import { ROLES } from '../constants/index.js'

export const  addCategory = async (req, res)=>{
    try {
        const name = req.body.name;
        const description = req.body.description;
        const products = req.body.products;
        const isActive = req.body.isActive;
      
        if (!description || !name) {
          return res
            .status(400)
            .json({ 
                message: "fail",
                data: 'You must enter description & name.' });
        }
      
        const category = new Category({
          name,
          description,
          products,
          isActive
        })
 
       const categoryDoc =  await category.save()
       res.status(200).json({
        message:"success",
        data: categoryDoc
    })
        
      } catch (error) {
        console.log(error)
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}
export const fetchListCategory = async (req, res)=>{
    try {
        const categories = await Category.find({ isActive: true });
        res.status(200).json({
            message: 'success',
            data: categories
        })
    } catch (error) {
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}
export const fetchCategory = async (req, res)=>{
    try {
        const categories = await Category.find({});
    res.status(200).json({
        message: 'success',
        data: categories
    })
    } catch (error) {
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}
export const fetchCategorybyId = async (req, res)=>{
    try {
        const categoryId = req.params.id;

        const categoryDoc = await Category.findOne({ _id: categoryId }).populate({
          path: 'products',
          select: 'name'
        });
    
        if (!categoryDoc) {
          return res.status(404).json({
            message: 'fail',
            data:"No Category found."
          });
        }
    
        res.status(200).json({
            message: 'success',
          category: categoryDoc
        }) 
    } catch (error) {
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}
export const updateCategory = async (req, res)=>{
    try {
        const categoryId = req.params.id;
        const update = req.body;
        const query = { _id: categoryId };
        const { slug } = req.body;
    
        const foundCategory = await Category.findOne({
          $or: [{ slug }]
        });
    
        if (foundCategory && foundCategory._id != categoryId) {
          return res.status(400).json({ 
            message: "fail",
            data: 'Slug is already in use.' });
        }
    
        await Category.findOneAndUpdate(query, update, {
          new: true
        });
    
        res.status(200).json({
          message: 'success',
          data: 'Category has been updated successfully!'
        })
    } catch (error) {
      console.log(error)
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}
export const updateCategoryActive = async (req, res)=>{
    try {
      const categoryId = req.params.id;
      const update = req.body;
      const query = { _id: categoryId };

    // disable category(categoryId) products
    if (!update.isActive) {
      const categoryDoc = await Category.findOne(
        { _id: categoryId, isActive: true },
        'products -_id'
      ).populate('products');

      disableProducts(categoryDoc.products);
    }

    await Category.findOneAndUpdate(query, update, {
      new: true
    });

    res.status(200).json({
        message: 'success',
        data: 'Category has been updated successfully!'
    })
    } catch (error) {
      console.log(error)
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}
export const deleteCategory = async (req, res)=>{
    try {
        const product = await Category.deleteOne({ _id: req.params.id });

        res.status(200).json({
          success: true,
          message: `Category has been deleted successfully!`,
          data: product
        })
    } catch (error) {
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}