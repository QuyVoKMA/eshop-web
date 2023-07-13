import express from 'express'
const route = express.Router()

import {
    addReview,
    fetchAllReview,
    fetchReviewId,
    updateReview,
    updateApproveReview,
    updateRejectReview,
    deleteReview
} from '../controllers/review.js'

route.post('/add', addReview)
route.get('/', fetchAllReview)
route.get('/:slug', fetchReviewId)
route.put('/:id', updateReview)
route.put('/approve/:reviewId', updateApproveReview)
route.put('/reject/:reviewId', updateRejectReview)
route.delete('/delete/:id', deleteReview)

export default route