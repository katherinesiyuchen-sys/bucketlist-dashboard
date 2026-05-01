import { Router } from "express";
import { supabase } from "../lib/supabase.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

function toClient(row) {
  return {
    id:          row.id,
    title:       row.title,
    targetDate:  row.target_date,
    tags:        row.tags       ?? [],
    notes:       row.notes      ?? "",
    steps:       row.steps      ?? [],
    location:    row.location   ?? "",
    imageUrl:    row.image_url  ?? "",
    spotifyUrl:  row.spotify_url ?? "",
    completed:   row.completed,
    completedAt: row.completed_at,
    createdAt:   row.created_at,
  };
}

const FIELD_MAP = {
  title:      "title",
  targetDate: "target_date",
  tags:       "tags",
  notes:      "notes",
  steps:      "steps",
  location:   "location",
  imageUrl:   "image_url",
  spotifyUrl: "spotify_url",
};

// GET /api/goals
router.get("/", requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", req.user.id)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data.map(toClient));
});

// POST /api/goals
router.post("/", requireAuth, async (req, res) => {
  const { title, targetDate, tags, notes, steps, location, imageUrl, spotifyUrl } = req.body;
  const { data, error } = await supabase
    .from("goals")
    .insert({
      user_id:     req.user.id,
      title,
      target_date: targetDate,
      tags:        tags       ?? [],
      notes:       notes      ?? "",
      steps:       steps      ?? [],
      location:    location   ?? "",
      image_url:   imageUrl   ?? "",
      spotify_url: spotifyUrl ?? "",
      completed:   false,
    })
    .select("id")
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ id: data.id });
});

// GET /api/goals/:goalId
router.get("/:goalId", requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("id", req.params.goalId)
    .eq("user_id", req.user.id)
    .single();

  if (error) return res.status(404).json({ error: "Goal not found" });
  res.json(toClient(data));
});

// PATCH /api/goals/:goalId
router.patch("/:goalId", requireAuth, async (req, res) => {
  const updates = {};
  for (const [key, col] of Object.entries(FIELD_MAP)) {
    if (key in req.body) updates[col] = req.body[key];
  }

  const { error } = await supabase
    .from("goals")
    .update(updates)
    .eq("id", req.params.goalId)
    .eq("user_id", req.user.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// DELETE /api/goals/:goalId
router.delete("/:goalId", requireAuth, async (req, res) => {
  const { error } = await supabase
    .from("goals")
    .delete()
    .eq("id", req.params.goalId)
    .eq("user_id", req.user.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// PATCH /api/goals/:goalId/complete
router.patch("/:goalId/complete", requireAuth, async (req, res) => {
  const { error } = await supabase
    .from("goals")
    .update({ completed: true, completed_at: new Date().toISOString() })
    .eq("id", req.params.goalId)
    .eq("user_id", req.user.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// PATCH /api/goals/:goalId/uncomplete
router.patch("/:goalId/uncomplete", requireAuth, async (req, res) => {
  const { error } = await supabase
    .from("goals")
    .update({ completed: false, completed_at: null })
    .eq("id", req.params.goalId)
    .eq("user_id", req.user.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

export default router;
