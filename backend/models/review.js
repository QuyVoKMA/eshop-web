import Mongoose from 'mongoose'
import { REVIEW_STATUS } from '../constants/index.js';

const { Schema } = Mongoose;

// Review Schema
const ReviewSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    default: null
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  title: {
    type: String,
    trim: true
  },
  rating: {
    type: Number,
    default: 0
  },
  review: {
    type: String,
    trim: true
  },
  isRecommended: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    default: REVIEW_STATUS.Waiting_Approval,
    enum: [
      REVIEW_STATUS.Waiting_Approval,
      REVIEW_STATUS.Rejected,
      REVIEW_STATUS.Approved
    ]
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  }
});

export default  Mongoose.model('Review', ReviewSchema);
