import { Router } from "express";
import { upload } from "../Middleware/Multer";
import { createProduct } from "../controller/product.controller";
const router = Router()

router.route('/add').post(upload.single("audio"), createProduct)

export default router