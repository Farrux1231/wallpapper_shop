import { Router } from "express";
import { create, findAll, findOne, remove, update } from "../controller/order.controller.js";
import authMiddleware from "../middleware/authMiddle.js";

const orderRoute = Router();

orderRoute.get('order/',authMiddleware([ "admin", "user"]), findAll);
orderRoute.get('order/:id',authMiddleware([ "admin", "user"]), findOne);
orderRoute.post('order/',authMiddleware([ "admin"]), create);
orderRoute.put('order/:id',authMiddleware([ "admin"]), update);
orderRoute.delete('order/:id',authMiddleware([ "admin"]), remove);

export default orderRoute;