import { Router } from "express";
import { create, findAll, findOne, remove, update } from "../controller/country.controller.js";
import authMiddleware from "../middleware/authMiddle.js";

const countryRoute = Router();

countryRoute.get("/country",authMiddleware([ "admin","user"]), findAll);
countryRoute.get("/country/:id",authMiddleware([ "admin","user"]), findOne);
countryRoute.post("/country",authMiddleware([ "admin"]), create);
countryRoute.patch("/country/:id",authMiddleware([ "admin"]), update);
countryRoute.delete("/country/:id",authMiddleware([ "admin"]), remove);

export default countryRoute;