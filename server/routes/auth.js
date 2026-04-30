import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();

function userProfile(user) {
  return {
    uid: user.id,
    email: user.email,
    displayName: user.user_metadata?.display_name ?? user.email.split("@")[0],
  };
}

// POST /api/auth/login — verify JWT, return profile
router.post("/login", verifyToken, (req, res) => {
  res.json(userProfile(req.user));
});

// GET /api/auth/me — return current user profile
router.get("/me", verifyToken, (req, res) => {
  res.json(userProfile(req.user));
});

export default router;
