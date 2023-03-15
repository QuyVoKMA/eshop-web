import express from 'express';
import { createProduct, deleteProduct, galleryImage, getbyidProduct, getFeatureProductCount, getProducts, getUserCount, updateProduct, uploadOptions } from '../controllers/product.controller.js';

const router = express.Router();

router.get("/", getProducts);
router.post("/",uploadOptions.single('image') ,createProduct);
router.get("/:id", getbyidProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.get("/get/featured/:count", getFeatureProductCount)
router.get("/get/count", getUserCount)
router.put("/gallery-images/:id",uploadOptions.array('images', 10), galleryImage)

export default router;