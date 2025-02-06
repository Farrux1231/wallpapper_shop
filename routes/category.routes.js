import { Router } from "express";
import { create, findAll, findOne,update, remove } from "../controller/category.controller.js";
import authMiddleware from "../middleware/authMiddle.js";
import upload from "../config/multer.js";

const categoryRoute = Router();

categoryRoute.get('category/',authMiddleware([ "admin", "user"]), findAll);
categoryRoute.get('category/:id',authMiddleware([ "admin", "user"]), findOne);
categoryRoute.post('category/',authMiddleware([ "admin"]),upload.single("image"), create);
categoryRoute.patch('category/:id', authMiddleware([ "admin"]),update);
categoryRoute.delete('category/:id',authMiddleware([ "admin"]), remove);

export default categoryRoute;
