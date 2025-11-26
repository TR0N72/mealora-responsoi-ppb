import express from "express";
import { body, validationResult } from "express-validator";
import { supabase } from "../lib/supabase";
import { authMiddleware, AuthenticatedRequest } from "../middleware/auth";

export const profileRouter = express.Router();

// All routes in this file are protected
profileRouter.use(authMiddleware);

// GET /api/v1/profile - Get user profile
profileRouter.get("/", async (req: AuthenticatedRequest, res) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("company_name, contact_phone, billing_address")
      .eq("id", req.user.sub)
      .single();

    if (error && error.code !== "PGRST116") { // PGRST116 = "The result contains 0 rows"
      throw error;
    }

    res.json(data);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/v1/profile - Update user profile
profileRouter.put(
  "/",
  body("company_name").optional().isString(),
  body("contact_phone").optional().isString(),
  body("billing_address").optional().isString(),
  async (req: AuthenticatedRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { company_name, contact_phone, billing_address } = req.body;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .upsert({
          id: req.user.sub,
          company_name,
          contact_phone,
          billing_address,
        })
        .select("company_name, contact_phone, billing_address")
        .single();

      if (error) {
        throw error;
      }

      res.json(data);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
);
