import e from "express";
import orderItemModel from "../models/order-Item.model.js";
import orderModel from "../models/order.model.js";




export const getOrders = async (req, res) =>{
    const orderList = await orderModel.find().populate('user', "name").sort({'dateOrdered': -1})

    if(!orderList){
        return res.status(500).send({message: "Can't get order list!"})
    }
    res.status(200).send(orderList)
}
export const getbyidOrder = async (req, res) =>{
    const order = await orderModel.findById(req.params.id).populate('user', "name")
    .populate({path: 'orderItems', populate:{path: 'product', populate: 'category'}} )

    if(!order){
        return res.status(500).send({message: "Can't get order list!"})
    }
    res.status(200).send(order)
}

export const createOrder = async (req,res)=>{
const orderItemsIds =  Promise.all(req.body.orderItems.map(async orderitem =>{
    let newOrderItem = new orderItemModel({
        quantity: orderitem.quantity,
        product: orderitem.product
    })
    newOrderItem = await newOrderItem.save()

    return newOrderItem._id;
}))

    const orderItemsIdsResolved = await orderItemsIds
    const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemsId) =>{
        const orderItem = await orderItemModel.findById(orderItemsId).populate('product', 'price')
        const totalPrice = orderItem.product.price * orderItem.quantity
        return totalPrice;
    }))

    const totalPrice = totalPrices.reduce((a,b) =>a + b, 0)
 
    let order = new orderModel({
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user,
    })

    order = await order.save()

    if(!order){
        return res.status(400).send('The order cannot be created!')
    }
    res.status(201).send(order)
}

export const updateOrder = async (req, res) =>{
    const order = await orderModel.findByIdAndUpdate(
        req.params.id,
        {
            status: req.body.status
        },
        {new: true}
    )
    if(!order){
        return res.status(400).send('The order cannot be updated!')
    }
    res.status(200).send(order)
}

export const deleteOrder = async (req, res) =>{
    orderModel.findByIdAndRemove(req.params.id).then(async order =>{
        if(order){
            await order.orderItems.map(async orderItem =>{
                await orderItemModel.findByIdAndRemove(orderItem)
            })
            return res.status(200).json({success: true, message: "The order is deleted!"})
        }else{
            return res.status(404).json({success: false, message: "The order not found"})
        }
    }).catch(err =>
        {
            return res.status(500).json({success: false, error: err})
        })
}

export const getTotalsalesOrder = async (req, res)=>{
    const totalSales = await orderModel.aggregate([
        {$group: {_id: null, totalsales:{$sum: '$totalPrice'}}}
    ])

    if(!totalSales){
        return res.status(400).send("The order sales cannot be generated")
    }
    res.send({totalsales: totalSales.pop().totalsales})
}

export const getCountOrder = async (req, res) =>{
    const orderCount = await orderModel.countDocuments({ "_id": { "$exists": true } })

    if(!orderCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        orderCount: orderCount
    });
}

export const getUserOrder = async (req,res) =>{
    const userOrderList = await orderModel.find({user: req.params.userid}).populate({
        path: 'orderItems', populate:{
            path: 'product', populate: 'category'
        }
    }).sort({'dateOrdered': -1})

    if(!userOrderList){
        res.status(500).json({success:false})
    }
    res.send(userOrderList)
}
