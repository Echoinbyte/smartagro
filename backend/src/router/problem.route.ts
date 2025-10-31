import { Router } from "express";
import { upload } from "../Middleware/Multer";
import { createProduct, createProductFromVoice } from "../controller/product.controller";
const router = Router()

router.route('/add-voice').post(upload.single("audio"), createProductFromVoice)
router.route('/add').post(createProduct)

export default router