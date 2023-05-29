import express  from "express";
import { authController, getUserProfile, registerUser, updateUserProfile } from "../controllers/usersController.js";
import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

//user registration
router.route("/").post(registerUser);

//post email and password auth
router.route("/login").post(authController);

//get user profile Private Route
router.route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);


export const usersRoutes = router;
