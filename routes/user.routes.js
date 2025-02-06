import { Router } from "express";
import { create, findAll, findOne, remove, update } from "../controller/user.controller.js";
import authMiddleware from "../middleware/authMiddle.js";

const userRoute = Router();

userRoute.get("/user",authMiddleware(["admin"]), findAll);
userRoute.get("/user/:id",authMiddleware(["admin"]), findOne);
userRoute.post("/user",authMiddleware(["admin"]), create);
userRoute.patch("/user/:id",authMiddleware([ "admin"]), update);
userRoute.delete("/user/:id",authMiddleware([ "admin"]), remove);

export default userRoute;