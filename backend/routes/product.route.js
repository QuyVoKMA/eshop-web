import express from 'express';
import { createProduct, deleteProduct, getbyidProduct, getFeatureProductCount, getProducts, updateProduct } from '../controllers/product.controller.js';

const router = express.Router();

router.get("/", getProducts);
router.post("/", createProduct);
router.get("/:id", getbyidProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.get("/get/featured/:count", getFeatureProductCount)

export default router;