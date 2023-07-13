// import multer from 'multer'
import Mongoose from 'mongoose'
import Product from '../models/product.js'
import Brand from '../models/brand.js'
import Category from '../models/category.js'
import checkAuth from '../utils/auth.js'
import {s3Upload} from '../utils/storage.js'
import {getStoreProductsQuery, getStoreProductsWishListQuery} from '../utils/queries.js'

// const storage = multer.memoryStorage()
// const upload = multer({storage})


export const fetchProductslug = async (req, res)=>{
    try {
        const slug = req.params.slug;

    const productDoc = await Product.findOne({ slug, isActive: true }).populate(
      {
        path: 'brand',
        select: 'name isActive slug'
      }
    );

    const hasNoBrand =
      productDoc?.brand === null || productDoc?.brand?.isActive === false;

    if (!productDoc || hasNoBrand) {
      return res.status(404).json({
        message: 'success',
        data: 'No product found.'
      });
    }

    res.status(200).json({
        message: "success",
        product: productDoc
    })
    } catch (error) {
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}
export const fetchProductSearch = async (req, res)=>{
    try {
        const name = req.params.name;

        const productDoc = await Product.find(
          { name: { $regex: new RegExp(name), $options: 'is' }, isActive: true },
          { name: 1, slug: 1, imageUrl: 1, price: 1, _id: 0 }
        );
    
        if (productDoc.length < 0) {
          return res.status(404).json({
            message: "fail",
            data: 'No product found.'
          });
        }
    
        res.status(200).json({
            message: 'success',
          products: productDoc
        })
    } catch (error) {
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}
export const fetchStoreProductbyAdvancedFilter = async (req, res)=>{
    try {
        let {
            sortOrder,
            rating,
            max,
            min,
            category,
            page = 1,
            limit = 10
          } = req.query;
          sortOrder = JSON.parse(sortOrder);
      
          const categoryFilter = category ? { category } : {};
          const basicQuery = getStoreProductsQuery(min, max, rating);
      
          const userDoc = await checkAuth(req);
          const categoryDoc = await Category.findOne(
            { slug: categoryFilter.category, isActive: true },
            'products -_id'
          );
      
          if (categoryDoc && categoryFilter !== category) {
            basicQuery.push({
              $match: {
                isActive: true,
                _id: {
                  $in: Array.from(categoryDoc.products)
                }
              }
            });
          }
      
          let products = null;
          const productsCount = await Product.aggregate(basicQuery);
          const count = productsCount.length;
          const size = count > limit ? page - 1 : 0;
          const currentPage = count > limit ? Number(page) : 1;
      
          // paginate query
          const paginateQuery = [
            { $sort: sortOrder },
            { $skip: size * limit },
            { $limit: limit * 1 }
          ];
      
          if (userDoc) {
            const wishListQuery = getStoreProductsWishListQuery(userDoc.id).concat(
              basicQuery
            );
            products = await Product.aggregate(wishListQuery.concat(paginateQuery));
          } else {
            products = await Product.aggregate(basicQuery.concat(paginateQuery));
          }
      
          res.status(200).json({
            message: 'success',
            products,
            totalPages: Math.ceil(count / limit),
            currentPage,
            count
          })
    } catch (error) {
      console.log(error)
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}
export const fetchStoreProductbyBrand = async (req, res)=>{
    try {
        const slug = req.params.slug;

        const brand = await Brand.findOne({ slug, isActive: true });
      
        if (!brand) {
          return res.status(404).json({
            message: `Cannot find brand with the slug: ${slug}.`
          });
        }
    
        const userDoc = await checkAuth(req);
       
        if (userDoc) {
          const products = await Product.aggregate([
            {
              $match: {
                isActive: true,
                brand: brand._id
              }
            },
            {
              $lookup: {
                from: 'wishlists',
                let: { product: '$_id' },
                pipeline: [
                  {
                    $match: {
                      $and: [
                        { $expr: { $eq: ['$$product', '$product'] } },
                        { user: new Mongoose.Types.ObjectId(userDoc.id) }
                      ]
                    }
                  }
                ],
                as: 'isLiked'
              }
            },
            {
              $lookup: {
                from: 'brands',
                localField: 'brand',
                foreignField: '_id',
                as: 'brands'
              }
            },
            {
              $addFields: {
                isLiked: { $arrayElemAt: ['$isLiked.isLiked', 0] }
              }
            },
            {
              $unwind: '$brands'
            },
            {
              $addFields: {
                'brand.name': '$brands.name',
                'brand._id': '$brands._id',
                'brand.isActive': '$brands.isActive'
              }
            },
            { $project: { brands: 0 } }
          ]);
    
          res.status(200).json({
            products: products.reverse().slice(0, 8),
            page: 1,
            pages: products.length > 0 ? Math.ceil(products.length / 8) : 0,
            totalProducts: products.length
          })
    }
 } catch (error) {
  console.log(error)
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}
export const fetchListProductSelect = async (req, res)=>{
    try {
        const products = await Product.find({}, 'name');

        res.status(200).json({
            message: 'success',
          products
        })
    } catch (error) {
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}
export const addProduct = async (req, res)=>{
    try {
        const sku = req.body.sku
        const name = req.body.name
        const description = req.body.description
        const quantity = req.body.quantity
        const price = req.body.price
        const taxable = req.body.taxable
        const isActive = req.body.isActive
        const brand = req.body.brand
        const category = req.body.category
        const image = req.file
  
        if (!sku) {
          return res.status(400).json({ error: 'You must enter sku.' });
        }
  
        if (!description || !name) {
          return res
            .status(400)
            .json({ error: 'You must enter description & name.' });
        }
  
        if (!quantity) {
          return res.status(400).json({ error: 'You must enter a quantity.' });
        }
  
        if (!price) {
          return res.status(400).json({ error: 'You must enter a price.' });
        }
  
        const foundProduct = await Product.findOne({ sku });
  
        if (foundProduct) {
          return res.status(400).json({ error: 'This sku is already in use.' });
        }
  
        const { imageUrl, imageKey } = await s3Upload(image);
  
        const product = new Product({
          sku,
          name,
          description,
          quantity,
          price,
          taxable,
          isActive,
          brand,
          category,
          imageUrl,
          imageKey
        });
  
        const savedProduct = await product.save();
  
        res.status(200).json({
          success: true,
          message: `Product has been added successfully!`,
          product: savedProduct
        })
    } catch (error) {
      console.log(error)
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}
export const fetchProduct = async (req, res)=>{
    try {
        let products = [];

        if (req.user.merchant) {
          const brands = await Brand.find({
            merchant: req.user.merchant
          }).populate('merchant', '_id');
  
          const brandId = brands[0]?.['_id'];
  
          products = await Product.find({})
            .populate({
              path: 'brand',
              populate: {
                path: 'merchant',
                model: 'Merchant'
              }
            })
            .where('brand', brandId);
        } else {
          products = await Product.find({}).populate({
            path: 'brand',
            populate: {
              path: 'merchant',
              model: 'Merchant'
            }
          });
        }
  
        res.status(200).json({
            message: "success",
          products
        })
    } catch (error) {
      console.log(error)
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}
export const fetchProductById = async (req, res)=>{
    try {
        const productId = req.params.id;

        let productDoc = null;
  
        if (req.user.merchant) {
          const brands = await Brand.find({
            merchant: req.user.merchant
          }).populate('merchant', '_id');
  
          const brandId = brands[0]['_id'];
  
          productDoc = await Product.findOne({ _id: productId })
            .populate({
              path: 'brand',
              select: 'name'
            })
            .where('brand', brandId);
        } else {
          productDoc = await Product.findOne({ _id: productId }).populate({
            path: 'brand',
            select: 'name'
          });
        }
  
        if (!productDoc) {
          return res.status(404).json({
            message: 'fail' ,
            data: 'No product found.'
          });
        }
  
        res.status(200).json({
            message:'success',
          product: productDoc
        })
    } catch (error) {
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}
export const updateProduct = async (req, res)=>{
    try {
        const productId = req.params.id;
        const update = req.body.product;
        const query = { _id: productId };
        const { sku, slug } = req.body.product;
  
        const foundProduct = await Product.findOne({
          $or: [{ slug }, { sku }]
        });
  
        if (foundProduct && foundProduct._id != productId) {
          return res
            .status(400)
            .json({ 
                message:'success',
                data: 'Sku or slug is already in use.' });
        }
  
        await Product.findOneAndUpdate(query, update, {
          new: true
        });
  
        res.status(200).json({
          success: true,
          message: 'success',
          data: 'Product has been updated successfully!'
        })
    } catch (error) {
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}
export const updateProductActive = async (req, res)=>{
    try {
        const productId = req.params.id;
        const update = req.body.product;
        const query = { _id: productId };
  
        await Product.findOneAndUpdate(query, update, {
          new: true
        });
  
        res.status(200).json({
          success: true,
          message: 'success' ,
          data: 'Product has been updated successfully!'
        })
    } catch (error) {
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}
export const deleteProduct = async (req, res)=>{
    try {
        const product = await Product.deleteOne({ _id: req.params.id });

        res.status(200).json({
          success: true,
          message: `Product has been deleted successfully!`,
          product
        })
    } catch (error) {
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}