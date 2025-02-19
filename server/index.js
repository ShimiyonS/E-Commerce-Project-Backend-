import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { MongoConnect } from "./Db.js";
import { productRoutes } from "./routes/productsRoute.js";
import { usersRoutes } from "./routes/UsersRoute.js";
import orderRoutes from "./routes/orderRoute.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";

dotenv.config();
const PORT = process.env.PORT || 8000;
const app = express();
app.use(express.json());

app.use(cors());
// DataBase Connectioins
MongoConnect();

//App initional Running
app.get("/", (req, res) => {
  res.send("<h1>Welcome to node server</h1>");
});

app.listen(PORT, () => console.log(`Listening to port ${PORT}`));

//api requests
app.use("/api", productRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/orders", orderRoutes);
app.get("/api/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID);
});

app.use(errorHandler);

