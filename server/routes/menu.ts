import express from "express";
import { body, query, validationResult } from "express-validator";
import { supabase } from "../lib/supabase.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";
import os from "os";

// Configure multer for file upload
const storage = multer.memoryStorage();

const upload = multer({ storage });

export const menuRouter = express.Router();

// Helper function to upload to Supabase Storage
async function uploadToSupabase(file: Express.Multer.File): Promise<string> {
  const filename = `${Date.now()}-${file.originalname}`;
  const { data, error } = await supabase.storage
    .from('menu_items') // Ensure this bucket exists in Supabase
    .upload(filename, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (error) {
    throw new Error(`Supabase storage upload failed: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from('menu_items')
    .getPublicUrl(filename);

  return publicUrlData.publicUrl;
}

// GET /api/v1/menu - Get menu items
menuRouter.get(
  "/",
  query("date").optional().isISO8601().toDate(),
  query("dietary_tags").optional().isArray(),
  query("category").optional().isString(),
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1 }).toInt(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { date, dietary_tags, category, page = 1, limit = 100 } = req.query;

      // Calculate pagination range
      const from = (Number(page) - 1) * Number(limit);
      const to = from + Number(limit) - 1;

      let queryBuilder = supabase.from("menus").select("*", { count: 'exact' });

      if (date) {
        queryBuilder = queryBuilder.eq("available_date", (date as Date).toISOString());
      }

      if (dietary_tags) {
        queryBuilder = queryBuilder.contains("dietary_tags", dietary_tags);
      }

      if (category) {
        queryBuilder = queryBuilder.eq("category", category);
      }

      // Apply pagination
      queryBuilder = queryBuilder.range(from, to);

      const { data, error, count } = await queryBuilder;

      if (error) {
        console.error("Supabase error fetching menu:", error);
        return res.status(500).json({ error: error.message, details: error });
      }

      // Return empty array if no data, but with pagination info
      res.json({
        data: data || [],
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: count || 0,
          totalPages: count ? Math.ceil(count / Number(limit)) : 0
        }
      });
    } catch (err: any) {
      console.error("Unexpected error in GET /menu:", err);
      res.status(500).json({ message: "Internal server error", error: err.message });
    }
  }
);

// Middleware to check if user is admin
const isAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = (req as any).headers.authorization;
  if (!authHeader) {
    return (res as any).status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { role: string };
    if (decoded.role !== "admin") {
      return (res as any).status(403).json({ message: "Admin access required" });
    }
    (next as any)();
  } catch (error) {
    return (res as any).status(401).json({ message: "Invalid token" });
  }
};

// POST /api/v1/menu - Create a new menu item (admin only)
menuRouter.post(
  "/",
  isAdmin,
  upload.single("image"),
  body("name").isString(),
  body("price").isNumeric(),
  body("available_date").optional().isISO8601().toDate(),
  body("stock_quantity").optional().isNumeric(),
  body("dietary_tags").optional().isArray(),
  body("nutritional_info").optional().isObject(),
  body("category").isString(),
  // body("image").optional().isString(), // Image is now handled by multer or body if URL
  async (req, res) => {
    // Validation errors might need to be checked differently if using multer
    // express-validator works with req.body, which multer populates
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      price,
      available_date,
      stock_quantity,
      dietary_tags,
      nutritional_info,
      category,
      image: imageUrl, // If user provided a URL
    } = req.body;

    let finalImage = imageUrl;
    if (req.file) {
      try {
        finalImage = await uploadToSupabase(req.file);
      } catch (error: any) {
        console.error("Upload error:", error);
        return res.status(500).json({ error: "Failed to upload image" });
      }
    }

    const { data, error } = await supabase
      .from("menus")
      .insert([
        {
          name,
          price,
          available_date,
          stock_quantity,
          dietary_tags,
          nutritional_info,
          category,
          image: finalImage,
        },
      ])
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data);
  }
);
// PUT /api/v1/menu/:id - Update a menu item (admin only)
menuRouter.put(
  "/:id",
  isAdmin,
  upload.single("image"),
  body("name").optional().isString(),
  body("price").optional().isNumeric(),
  body("available_date").optional().isISO8601().toDate(),
  body("stock_quantity").optional().isNumeric(),
  body("dietary_tags").optional().isArray(),
  body("nutritional_info").optional().isObject(),
  body("category").optional().isString(),
  async (req, res) => {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      price,
      available_date,
      stock_quantity,
      dietary_tags,
      nutritional_info,
      category,
      image: imageUrl,
    } = req.body;

    let finalImage = imageUrl;
    if (req.file) {
      try {
        finalImage = await uploadToSupabase(req.file);
      } catch (error: any) {
        console.error("Upload error:", error);
        return res.status(500).json({ error: "Failed to upload image" });
      }
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (price) updateData.price = price;
    if (available_date) updateData.available_date = available_date;
    if (stock_quantity) updateData.stock_quantity = stock_quantity;
    if (dietary_tags) updateData.dietary_tags = dietary_tags;
    if (nutritional_info) updateData.nutritional_info = nutritional_info;
    if (category) updateData.category = category;
    if (finalImage) updateData.image = finalImage;

    const { data, error } = await supabase
      .from("menus")
      .update(updateData)
      .eq("id", id)
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  }
);
// DELETE /api/v1/menu/:id - Delete a menu item (admin only)
menuRouter.delete("/:id", isAdmin, async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from("menus").delete().eq("id", id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(204).send();
});
