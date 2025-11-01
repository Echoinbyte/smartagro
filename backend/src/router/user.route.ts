import { Router } from "express";
import { createUser, verifyFarmerKYC } from "../controller/user.controller";
import { upload } from "../Middleware/Multer";
const router = Router();

router.route("/create").post( createUser);
router.route("/verify").post(
  upload.fields([
    {
      name: "citizenship-front",
      maxCount: 1,
    },
    {
      name: "citizenship-back",
      maxCount: 1,
    },
  ]),
  verifyFarmerKYC
);

export default router;
