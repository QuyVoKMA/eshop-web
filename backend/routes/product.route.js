import express from 'express';
import { createProduct, deleteProduct, getbyidProduct, getFeatureProductCount, getProducts, getUserCount, updateProduct } from '../controllers/product.controller.js';

const router = express.Router();

router.get("/", getProducts);
router.post("/", createProduct);
router.get("/:id", getbyidProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.get("/get/featured/:count", getFeatureProductCount)
router.get("/get/count", getUserCount)

export default router;