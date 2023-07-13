import Order from '../models/order.js'
import Cart from '../models/cart.js'
import Product from '../models/product.js'
import {sendEmail} from '../services/mailgun.js'
import {caculateTaxAmount, formatOrders} from '../utils/store.js'
import {ROLES, CART_ITEM_STATUS} from '../constants/index.js'
import mongoose from 'mongoose'
import order from '../models/order.js'

export const addOrder = async (req, res)=>{
    try {
        const cart = req.body.cartId
        const total = req.body.total
        const user = req.user._id

        const order = new Order({
            cart,
            user,
            total
        })
        const orderDoc = await order.save()
        const cartDoc = await Cart.findById(orderDoc.cart._id).populate({
           path: 'products.product',
           populate:{
            path: 'brand'
           } 
        })

        const newOrder = {
            _id: orderDoc._id,
            created: orderDoc.created,
            user: orderDoc.user,
            total: orderDoc.total,
            products: orderDoc.products
        }
        await sendEmail(order.user.email, 'order-confirmation', newOrder)
        res.status(200).json({
            success: true,
            message: `Your order has been placed successfully!`,
            order: { _id: orderDoc._id }
          })
    } catch (error) {
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}
export const searchOrder = async (req, res)=>{
    try {
        const {search} = req.query
        if(!mongoose.Types.ObjectId.isValid(search)){
            return res.status(200).json({
                message: "error",
                orders: []
            })
        }
        let orderDoc = null

        if(req.user.role === ROLES.Admin){
            orderDoc = await Order.find({
                _id: mongoose.Types.ObjectId(search)
            }).populate({
                path: 'cart',
                populate:{
                    path: 'products.product',
                    populate:{
                        path: 'brand'
                    }
                }
            })
        }else{
            const user = req.user._id
            orderDoc = await Order.find({
                _id: mongoose.Types.ObjectId(search),
                user
            }).populate({
                path: 'cart',
                populate:{
                    path: 'brand'
                }
            })
        }

        orderDoc = orderDoc.filter(order =>order.cart)
        if(orderDoc.length > 0){
            const newOrders = orderDoc.map(o => {
                return {
                    _id: o._id,
                    total: parseFloat(Number(o.total.toFixed(2))),
                    created: o.created,
                    products: o.cart?.products,
                }
            })
            let orders = newOrders.map(o => caculateTaxAmount(o));
            orders.sort((a, b) => b.created - a.created);
            res.status(200).json({
              orders
            });
          } else {
            res.status(200).json({
                message: "success",
                orders: []
            });
          }
      
    } catch (error) {
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}
export const fetchOrder = async (req, res)=>{
    try {
        const { page = 1, limit = 10 } = req.query;
        const ordersDoc = await Order.find()
          .sort('-created')
          .populate({
            path: 'cart',
            populate: {
              path: 'products.product',
              populate: {
                path: 'brand'
              }
            }
          })
          .limit(limit * 1)
          .skip((page - 1) * limit)
          .exec();
    
        const count = await Order.countDocuments();
        const orders = formatOrders(ordersDoc);
    
        res.status(200).json({
            message: "success",
            orders,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
            count
        })
    } catch (error) {
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}
export const fetchmyOrder = async (req, res)=>{
    try {
        const { page = 1, limit = 10 } = req.query;
        const user = req.user._id;
        const query = { user };
    
        const ordersDoc = await Order.find(query)
          .sort('-created')
          .populate({
            path: 'cart',
            populate: {
              path: 'products.product',
              populate: {
                path: 'brand'
              }
            }
          })
          .limit(limit * 1)
          .skip((page - 1) * limit)
          .exec();
    
        const count = await Order.countDocuments(query);
        const orders = formatOrders(ordersDoc);
    
        res.status(200).json({
          orders,
          totalPages: Math.ceil(count / limit),
          currentPage: Number(page),
          count
        })
    } catch (error) {
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}
export const fetchOrderId = async (req, res)=>{
    try {
        const orderId = req.params.orderId;

        let orderDoc = null;
    
        if (req.user.role === ROLES.Admin) {
          orderDoc = await Order.findOne({ _id: orderId }).populate({
            path: 'cart',
            populate: {
              path: 'products.product',
              populate: {
                path: 'brand'
              }
            }
          });
        } else {
          const user = req.user._id;
          orderDoc = await Order.findOne({ _id: orderId, user }).populate({
            path: 'cart',
            populate: {
              path: 'products.product',
              populate: {
                path: 'brand'
              }
            }
          });
        }
    
        if (!orderDoc || !orderDoc.cart) {
          return res.status(404).json({
            message: "fail",
            data: `Cannot find order with the id: ${orderId}.`
          });
        }
    
        let order = {
          _id: orderDoc._id,
          total: orderDoc.total,
          created: orderDoc.created,
          totalTax: 0,
          products: orderDoc?.cart?.products,
          cartId: orderDoc.cart._id
        };
    
        order = caculateTaxAmount(order);
    
        res.status(200).json({
            message: 'success',
            data: order
        })
    } catch (error) {
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}
export const deleteOrder = async (req, res)=>{
    try {
        const orderId = req.params.orderId;

    const order = await Order.findOne({ _id: orderId });
    const foundCart = await Cart.findOne({ _id: order.cart });

    increaseQuantity(foundCart.products);

    await Order.deleteOne({ _id: orderId });
    await Cart.deleteOne({ _id: order.cart });

    res.status(200).json({
      message: 'success',
      data: 'OK'
    })
    } catch (error) {
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}
export const updateOrder = async (req, res)=>{
    try {
        const itemId = req.params.itemId;
        const orderId = req.body.orderId;
        const cartId = req.body.cartId;
        const status = req.body.status || CART_ITEM_STATUS.Cancelled;
    
        const foundCart = await Cart.findOne({ 'products._id': itemId });
        const foundCartProduct = foundCart.products.find(p => p._id == itemId);
    
        await Cart.updateOne(
          { 'products._id': itemId },
          {
            'products.$.status': status
          }
        );
    
        if (status === CART_ITEM_STATUS.Cancelled) {
          await Product.updateOne(
            { _id: foundCartProduct.product },
            { $inc: { quantity: foundCartProduct.quantity } }
          );
    
          const cart = await Cart.findOne({ _id: cartId });
          const items = cart.products.filter(
            item => item.status === CART_ITEM_STATUS.Cancelled
          );
    
          // All items are cancelled => Cancel order
          if (cart.products.length === items.length) {
            await Order.deleteOne({ _id: orderId });
            await Cart.deleteOne({ _id: cartId });
    
            return res.status(200).json({
                message:"success",
              success: true,
              orderCancelled: true,
              data: `${
                req.user.role === ROLES.Admin ? 'Order' : 'Your order'
              } has been cancelled successfully`
            });
          }
    
          return res.status(200).json({
            message: 'success',
            data: 'Item has been cancelled successfully!'
          });
        }
    
        res.status(200).json({
          success: true,
          message: 'success',
          data: 'Item status has been updated successfully!'
        })
    } catch (error) {
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}

const increaseQuantity = products => {
    let bulkOptions = products.map(item => {
      return {
        updateOne: {
          filter: { _id: item.product },
          update: { $inc: { quantity: item.quantity } }
        }
      };
    });
  
    Product.bulkWrite(bulkOptions);
  };