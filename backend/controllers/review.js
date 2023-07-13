import Review from '../models/review.js'
import Product from '../models/product.js'
import {REVIEW_STATUS} from '../constants/index.js'

export const addReview = async (req, res)=>{
    try {
        const user = req.user;

    const review = new Review({
      ...req.body,
      user: user._id
    });

    const reviewDoc = await review.save();

    res.status(200).json({
      success: true,
      message: `Your review has been added successfully and will appear when approved!`,
      review: reviewDoc
    })
    } catch (error) {
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}
export const fetchAllReview = async (req, res)=>{
    try {
        const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find()
      .sort('-created')
      .populate({
        path: 'user',
        select: 'firstName'
      })
      .populate({
        path: 'product',
        select: 'name slug imageUrl'
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Review.countDocuments();

    res.status(200).json({
        message: 'success',
      reviews,
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
export const fetchReviewId = async (req, res)=>{
    try {
        const productDoc = await Product.findOne({ slug: req.params.slug });

        const hasNoBrand =
          productDoc?.brand === null || productDoc?.brand?.isActive === false;
    
        if (!productDoc || hasNoBrand) {
          return res.status(404).json({
            message: 'fail',
            data: 'No product found.'
          });
        }
    
        const reviews = await Review.find({
          product: productDoc._id,
          status: REVIEW_STATUS.Approved
        })
          .populate({
            path: 'user',
            select: 'firstName'
          })
          .sort('-created');
    
        res.status(200).json({
            message: 'success',
          data: reviews
        })
    } catch (error) {
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}
export const updateReview = async (req, res)=>{
    try {
        const reviewId = req.params.id;
        const update = req.body;
        const query = { _id: reviewId };
    
        await Review.findOneAndUpdate(query, update, {
          new: true
        });
    
        res.status(200).json({
          success: true,
          message: 'success',
          data: 'review has been updated successfully!'
        })
    } catch (error) {
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}
export const updateApproveReview = async (req, res)=>{
    try {
        const reviewId = req.params.reviewId;

    const query = { _id: reviewId };
    const update = {
      status: REVIEW_STATUS.Approved,
      isActive: true
    };

    await Review.findOneAndUpdate(query, update, {
      new: true
    });

    res.status(200).json({
      success: true,
      message:"success",
      data: "OK"
    })
    } catch (error) {
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}
export const updateRejectReview = async (req, res)=>{
    try {
        const reviewId = req.params.reviewId;

    const query = { _id: reviewId };
    const update = {
      status: REVIEW_STATUS.Rejected
    };

    await Review.findOneAndUpdate(query, update, {
      new: true
    });

    res.status(200).json({
      success: true,
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
export const deleteReview = async (req, res)=>{
    try {
        const review = await Review.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: `review has been deleted successfully!`,
      data: review
    })
    } catch (error) {
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}