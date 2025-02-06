import { Router } from "express";
import { create, remove, findOne, findAll, update } from "../controller/product.controller.js";
import authMiddleware from "../middleware/authMiddle.js";
import upload from "../config/multer.js";


const productRoute = Router();


productRoute.get("/product",authMiddleware([ "admin", "user"]), findAll);
productRoute.get("/product/:id",authMiddleware([ "admin", "user"]), findOne);
productRoute.post("/product",authMiddleware([ "admin"]),upload.single("image"), create);
productRoute.patch("/product/:id",authMiddleware([ "admin"]), update);
productRoute.delete("/product/:id", authMiddleware([ "admin"]),remove);

export default productRoute;