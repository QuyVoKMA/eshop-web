import Cart from '../models/cart.js'
import Product from '../models/product.js'
import {caculateItemsSalesTax} from '../utils/store.js'

export const addCart = async (req, res)=>{
    try {
        const user = req.user._id
        const items = req.body.products
        const products = caculateItemsSalesTax(items)
        const cart = new Cart({
            user,
            products
        })
        const cartDoc =await cart.save()
        decreaseQuantity(products)
        res.status(200).json({
            message: "success",
            cartId: cartDoc.id
        })
    } catch (error) {
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}
export const addCartId = async (req, res)=>{
    try {
        const product = req.body.product;
        const query = { _id: req.params.cartId };
    
        await Cart.updateOne(query, { $push: { products: product } }).exec();
    
        res.status(200).json({
          message: 'success',
          data: "OK"
        })
    } catch (error) {
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}
export const deleteCart = async (req, res)=>{
    try {
        await Cart.deleteOne({ _id: req.params.cartId });

        res.status(200).json({
            message: 'success',
            data: "deleted"
        })
    } catch (error) {
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}
export const deleteCartProduct = async (req, res)=>{
    try {
        const product = { product: req.params.productId };
    const query = { _id: req.params.cartId };

    await Cart.updateOne(query, { $pull: { products: product } }).exec();

    res.status(200).json({
        message: 'success',
        data: "deleted"
    })
    } catch (error) {
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}

const decreaseQuantity = products => {
    let bulkOptions = products.map(item =>{
        return {
            updateOne:{
                filter:{_id: item.product},
                update:{$inc: {quantity: -item.quantity}}
            }
        }
    })
    Product.bulkOptions(bulkOptions)
}