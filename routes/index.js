import { Router } from "express";
import countryRoute from "./country.routes.js";
import userRoute from "./user.routes.js";
import categoryRoute from "./category.routes.js";
import orderRoute from "./order.routes.js";
import branRoute from "./brand.routes.js";
import productRoute from "./product.routes.js";


const mainRoute = Router();

mainRoute.use("/", countryRoute);
mainRoute.use("/", userRoute);
mainRoute.use("/", categoryRoute);
mainRoute.use("/", orderRoute);
mainRoute.use("/", branRoute);
mainRoute.use("/", productRoute);

export default mainRoute;