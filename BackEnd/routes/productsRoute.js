import express from "express";
import { create_Categories, getProduct, getProducts } from "../controllers/productController.js";
const router = express.Router();

router.route("/").get(create_Categories)
//GET ROUTE FOR ALL PRODUCTS
router.route("/products").get(getProducts)

//GET ROUTE FOR SINGLE PRODUCT
router.route("/products/:id").get(getProduct);


export const productRoutes = router;
