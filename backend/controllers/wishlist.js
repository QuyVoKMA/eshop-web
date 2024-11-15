import Wishlist from '../models/wishlist.js'



export const postWishlist = async (req, res) =>{
    try {
        const {product, isLiked} = req.body
        const user = req.user
        const update = {
            product,
            isLiked,
            updated: Date.now()
        }
        const query = {product: update.product, user:user._id}
        const updateWishlist = await Wishlist.findByIdAndUpdate(query, update,{new: true})
        if(updateWishlist !==null){
            res.status(200).json({
                success: true,
                message: 'Your Wishlist has been updated successfully!',
                wishlist: updateWishlist
            })
        }else{
            const wishlists = new Wishlist({
                product,
                isLiked,
                user:user._id
            })
            const wishlistDoc = await wishlists.save()

            res.status(200).json({
                success: true,
                message: `Added to your Wishlist successfully!`,
                wishlist: wishlistDoc
              })
        }
    } catch (error) {
        return res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}

export const fetchwishlist = async (req, res) =>{
    try {
        const user = req.user._id
        const wishlist = await Wishlist.find({user, isLiked: true})
        .populate({
            path: 'product',
            select: 'name slug price imageUrl'
        })
        .sort('-updated')
        res.status(200).json({
            wishlist
        })
    } catch (error) {
        return res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}