import Address from '../models/address.js'

export const addAddress = async (req, res)=>{
    try {
        const user = req.user
        const address = new Address({
            ...req.body,
            user: user._id
        })
        const addressDoc = await address.save()

        res.status(200).json({
            success: true,
            message:"Address has been added successfully!",
            address: addressDoc
        })
    } catch (error) {
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}

export const fetchAddress = async (req, res)=>{
    try {
        const addresses = await Address.find({user: req.user._id})
        res. status(200).json({
            message: "success",
            data: addresses
        })
    } catch (error) {
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}

export const fetchAddressById = async (req, res)=>{
    try {
        const addressId = req.params._id
        const addressDoc = await Address.findOne({_id: addressId})
        if(!addressDoc){
            res.status(404).json({
                message: "fail",
                data: `Cannot find Address with the id: ${addressId}`
            })
        }
        res.status(200).json({
            message: "success",
            data: addressDoc
        })
    } catch (error) {
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}

export const updateAddress = async (req, res)=>{
    try {
       const addressId = req.params._id
       const update = req.body
       const query = {_id: addressId}
       
       await Address.findOneAndUpdate(query, update,{new: true})
       res.status(200).json({
        message:"success",
        data:'Address has been updated successfully!'
       })
    } catch (error) {
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}

export const deleteAddress = async (req, res)=>{
    try {
        const address = await Address.deleteOne({_id: req.params._id})
        res.status(200).json({
            message: 'Address has been deleted successfully!',
            data: address
        })
    } catch (error) {
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}

