import express from "express";
import {
  signup,
  signin,
  logout,
  googleAuthSignIn,
  generateOTP,
  verifyOTP,
  createResetSession,
  findUserByEmail,
  resetPassword,
} from "../controllers/authController.js";
import {
  validateSignup,
  validateSignin,
  validateForgotPassword,
  validateResetPassword,
} from "../validators/validators.js";
import { localVariables } from "../middleware/auth.js";

const router = express.Router();

//create a user
router.post("/signup", validateSignup, signup);
//signin
router.post("/signin", validateSignin, signin);
//logout
router.post("/logout", logout);
//google signin
router.post("/google", googleAuthSignIn);
//find user by email
router.get("/findbyemail", findUserByEmail);
//generate opt
router.get("/generateotp", validateForgotPassword, localVariables, generateOTP);
//verify opt
router.get("/verifyotp", verifyOTP);
//create reset session
router.get("/createResetSession", createResetSession);
//forget password
router.put("/reset-password", validateResetPassword, resetPassword);

export default router;
