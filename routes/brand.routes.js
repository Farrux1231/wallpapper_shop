import { Router } from "express";
import { create, remove, findOne, findAll, update } from "../controller/brand.controller.js";
import authMiddleware from "../middleware/authMiddle.js";
import upload from "../config/multer.js";

const branRoute = Router();

branRoute.get("/brand",authMiddleware([ "admin", "user"]), findAll);
branRoute.get("/brand/:id",authMiddleware([ "admin", "user"]), findOne);
branRoute.post("/brand",authMiddleware([ "admin"]),upload.single("image"), create);
branRoute.patch("brand/:id",authMiddleware([ "admin"]), update);
branRoute.delete("/brand/:id",authMiddleware([ "admin"]), remove);

export default branRoute;