import { Router } from "express";
import { supabase } from "../lib/supabase.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();

const BADGE_CRITERIA = [
  { id: "first_dream", label: "First Dream", description: "Complete your first goal", threshold: 1 },
  { id: "second_dream", label: "Second Dream", description: "Complete 2 goals", threshold: 2 },
  { id: "five_dreams", label: "Five Dreams", description: "Complete 5 goals", threshold: 5 },
  { id: "ten_dreams", label: "Dream Chaser", description: "Complete 10 goals", threshold: 10 },
];

// GET /api/badges
router.get("/", verifyToken, async (req, res) => {
  const { count, error } = await supabase
    .from("goals")
    .select("*", { count: "exact", head: true })
    .eq("user_id", req.user.id)
    .eq("completed", true);

  if (error) return res.status(500).json({ error: error.message });

  const completedCount = count ?? 0;
  const badges = BADGE_CRITERIA.map((badge) => ({
    ...badge,
    earned: completedCount >= badge.threshold,
  }));

  res.json({ completedCount, badges });
});

export default router;
