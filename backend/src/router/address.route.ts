import { Router } from "express";
import { createAddress } from "../controller/address.controller";
const router = Router();

router.route("/create").post(createAddress);

export default router;
