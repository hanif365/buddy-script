import { Router } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { verifyToken } from "../../middlewares/auth.middleware";
import { register, login, googleAuth, logout, getMe } from "./auth.controller";

const router = Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.post("/google", asyncHandler(googleAuth));
router.post("/logout", asyncHandler(logout));
router.get("/me", asyncHandler(verifyToken), asyncHandler(getMe));

export default router;
