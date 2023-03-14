import categoryModel from '../models/category.model.js';
import  Product  from '../models/product.model.js';
import mongoose from 'mongoose';
import productModel from '../models/product.model.js';


export const getProducts = async (req, res)=>{
    let filter = {}
    if(req.query.categories){
        const filter = {category: req.query.categories.split(",")}
    }
    const productList = await Product.find(filter).populate('category');
    if(!productList){
        res.status(500).json({
            success: false
        })
    }
        res.status(200).send(productList)
    
}

export const createProduct = async (req, res)=>{
    const category = await categoryModel.findById(req.body.category)
    if(!category) return res.status(400).send('Invalid Category')

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    })
    product = await product.save()
   if(!product){
    return res.status(500).send('The product cannot be created')
   }
   res.status(201).send(product)
};

export const getbyidProduct = async (req, res) =>{
    const product = await Product.findById(req.params.id).populate('category');

    if(!product){
        res.status(500).json({success: false})
    }
    res.status(200).send(product)
};

export const updateProduct = async (req, res) =>{
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send("Invalid Product Id")
    }
    const category = await categoryModel.findById(req.body.category)
    if(!category) return res.status(400).send('Invalid Category')
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        },
        {new: true}
    )
    if(!product){
        return res.status(500).send('the product cannot be updated!')
    }
    res.send(product)
};

export const deleteProduct = async (req,res) =>{
    Product.findByIdAndRemove(req.params.id).then(product =>{
        if(product){
            return res.status(200).json({success: true, message:"the product is deleted!"})
        }else{
            return res.status(404).json({success: false, message: "product is not found!"})
        }
    }).catch(err=>{
        return res.status(400).json({success: false, error: err})
    })
};

export const getFeatureProductCount = async (req, res) =>{
    const count = req.params.count ? req.params.count : 0
    const products = await productModel.find({isFeatured: true}).limit(+count)

    if(!products){
        res.status(500).json({success: false})
    }
    res.status(200).send(products)
}

export const getUserCount = async (req, res) =>{
    const productCount = await productModel.countDocuments({ "_id": { "$exists": true }})

    if(!productCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        productCount: productCount
    });
}