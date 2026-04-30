import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

function userProfile(user) {
  return {
    uid: user.id,
    email: user.email,
    displayName: user.user_metadata?.display_name ?? user.email.split("@")[0],
  };
}

router.post("/login", requireAuth, (req, res) => {
  res.json(userProfile(req.user));
});

router.get("/me", requireAuth, (req, res) => {
  res.json(userProfile(req.user));
});

export default router;
