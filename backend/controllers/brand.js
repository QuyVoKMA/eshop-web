import Brand from '../models/brand.js'
import Product from '../models/product.js'
import Merchant from '../models/merchant.js'
import {disableProducts} from '../utils/store.js'
import {ROLES, MERCHANT_STATUS} from '../constants/index.js'

export const addBrand = async (req, res)=>{
    try {
        const name = req.body.name
        const description = req.body.description
        const isActive = req.body.isActive
        if(!description || !name){
            res.status(400).json({
                message:"fail",
                data: "You must enter description & name"
            })
        }
        const brand = new Brand({
            name,
            description,
            isActive
        })
      
        const brandDoc = await brand.save()
        
        res.status(200).json({
            message:"success",
            data: brandDoc
        })
    } catch (error) {   
        console.log(error)
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}
export const fetchStoreBrandList = async (req, res)=>{
    try {
        const brands = await Brand.find({
            isActive: true
        }).populate('merchant', 'name')
        res.status(200).json({
            message: "success",
            data:brands
        })
    } catch (error) {
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}
export const fetchBands = async (req, res)=>{
    try {
        let brands = null 
        console.log("req.user.merchant", req.params.merchant)
        if(req.user.merchant){
            brands = await Brand.find({
                merchant: req.user.merchant
            }).populate('merchant', 'name')
            console.log(brands)
        }else{
            brands = await Brand.find({}).populate('merchant', 'name')
        }
        res.status(200).json({
            message:"success",
            data: brands
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}
export const fetchBrandById = async (req, res)=>{
    try {
        const brandId = req.params.id
        const brandDoc = await Brand.findOne({_id: brandId}).populate(
            "merchant",
            "_id"
        )
        if(!brandDoc){
            res.status(404).json({
                message: "fail",
                data: `Cannot find brand with the id: ${brandId}.`
            })
        }
        res.status(200).json({
            message: 'success',
            data: brandDoc
        })
    } catch (error) {
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}
export const fetchListBrandSelect = async (req, res)=>{
    try {
        let brands = null

        if(req.user.merchant){
            brands = await Brand.find(
                {
                    merchant: req.user.merchant
                },
                'name'
            )
        }else{
            brands = await Brand.find({}, 'name')
        }
        res.status(200).json({
            message: 'success',
            data: brands
        })
    } catch (error) {
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}
export const updateBrand = async (req, res)=>{
    try {
        const brandId = req.params.id
        const update = req.body
        const query = {_id: brandId}
        const   {slug}   = req.body
      
        const foundBrand = await Brand.findOne({
            $or:[{slug}]
        })
       
        if(foundBrand && foundBrand._id != brandId){
            return res.status(400).json({
                message: "fail",
                data: 'Slug is already in use. '
            })
        }
        await Brand.findByIdAndUpdate(query,update,{
            new: true
        })
     
        res.status(200).json({
            message: 'success',
            data: 'Brand has been updated successfully!'
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}
export const updateBrandActive = async (req, res)=>{
    try {
        const brandId = req.params.id
        const update = req.body
        const query = { _id: brandId }
  
        // disable brand(brandId) products
        if (!update.isActive) {
          const products = await Product.find({ brand: brandId });
          disableProducts(products);
        }
  
        await Brand.findOneAndUpdate(query, update, {
          new: true
        });
  
        res.status(200).json({
          message:'success',
          data: 'Brand has been updated successfully!'
        });
    } catch (error) {
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}
export const deleteBrand = async (req, res)=>{  
    try {
        const brandId = req.params.id;
        await deactivateMerchant(brandId);
        const brand = await Brand.deleteOne({ _id: brandId });
  
        res.status(200).json({
          message:'success',
          data: brand,
        });
    } catch (error) {
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}

const deactivateMerchant = async brandId => {
    const brandDoc = await Brand.findOne({ _id: brandId }).populate(
      'merchant',
      '_id'
    );
    if (!brandDoc || !brandDoc.merchant) return;
    const merchantId = brandDoc.merchant._id;
    const query = { _id: merchantId };
    const update = {
      status: MERCHANT_STATUS.Watting_Approval,
      isActive: false,
      brand: null
    };
    return await Merchant.findOneAndUpdate(query, update, {
      new: true
    })
  }