import { users } from "../data/users.js";
import Product from "../models/ProductModel.js";
import asyncHandler from "express-async-handler";
import User from "../models/UserModel.js";
import { products } from "../data/products.js";
        
async function create_Categories(req, res){
  try {
    const createUser = await User.insertMany(users);
    const adminUser = createUser[0]._id;
    const sampleData = products.map((product) => {
      return { ...product, user: adminUser };
    });
    const thinks = await Product.insertMany(sampleData);
    res.status(200).json("created");
    } catch (error) {
      console.log(error)
      res.status(500).json({message:"Internal server error"})
  }

}
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  // throw new Error("Some Eror");
  res.json(products);
});

const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Product Not Found" });
  }
});

export { create_Categories, getProducts, getProduct };
