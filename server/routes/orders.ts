import express from "express";
import { body, param, validationResult } from "express-validator";
import { supabase } from "../lib/supabase.js";
import { authMiddleware, AuthenticatedRequest } from "../middleware/auth.js";

export const ordersRouter = express.Router();

// All routes in this file are protected
ordersRouter.use(authMiddleware);

// GET /api/v1/orders - Get order history
ordersRouter.get("/", async (req: AuthenticatedRequest, res) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("id, status, total_price, delivery_window_start, delivery_window_end, created_at")
      .eq("user_id", req.user.sub);

    if (error) {
      throw error;
    }
    res.json(data);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/orders/:orderId - Get a specific order
ordersRouter.get(
  "/:orderId",
  param("orderId").isUUID(),
  async (req: AuthenticatedRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { orderId } = req.params;

    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*, menus(*))")
        .eq("id", orderId)
        .eq("user_id", req.user.sub)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        return res.status(404).json({ message: "Order not found." });
      }

      res.json(data);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
);

// POST /api/v1/orders - Create a new order
ordersRouter.post(
  "/",
  body("delivery_window_start").isISO8601().toDate(),
  body("delivery_window_end").isISO8601().toDate(),
  body("items").isArray({ min: 1 }),
  body("items.*.menu_id").isUUID(),
  body("items.*.quantity").isInt({ gt: 0 }),
  async (req: AuthenticatedRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { delivery_window_start, delivery_window_end, items } = req.body;

    try {
      // 24-hour lead time protocol
      const leadTime = 24 * 60 * 60 * 1000;
      if (new Date(delivery_window_start).getTime() - new Date().getTime() < leadTime) {
        return res.status(400).json({ message: "Delivery time must be at least 24 hours in advance." });
      }

      // Dynamic pricing engine and stock check
      const menuIds = items.map((item: { menu_id: string }) => item.menu_id);
      const { data: menuItems, error: menuFetchError } = await supabase
        .from("menus")
        .select("id, price, stock_quantity")
        .in("id", menuIds);

      if (menuFetchError) {
        throw menuFetchError;
      }

      if (!menuItems || menuItems.length === 0) {
        return res.status(400).json({ message: "No valid menu items found." });
      }

      let totalPrice = 0;
      const orderItemsToInsert = [];

      for (const item of items) {
        const menuItem = menuItems.find((menuItem) => menuItem.id === item.menu_id);
        if (!menuItem) {
          return res.status(400).json({ message: `Menu item with id ${item.menu_id} not found.` });
        }
        if (menuItem.stock_quantity < item.quantity) {
          return res.status(400).json({ message: `Not enough stock for menu item ${menuItem.id}. Only ${menuItem.stock_quantity} available.` });
        }
        totalPrice += parseFloat(menuItem.price as any) * item.quantity;
        orderItemsToInsert.push({ menu_id: item.menu_id, quantity: item.quantity, unit_price: parseFloat(menuItem.price as any) });
      }

      if (totalPrice > 500) {
        totalPrice *= 0.9; // Apply 10% discount
      }

      // Create the order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: req.user.sub,
          status: 'pending',
          total_price: totalPrice,
          delivery_window_start,
          delivery_window_end,
        })
        .select("id")
        .single();

      if (orderError) {
        throw orderError;
      }

      const order_id = orderData.id;

      // Insert order items and update stock
      for (const item of orderItemsToInsert) {
        await supabase.from("order_items").insert({
          order_id,
          menu_id: item.menu_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
        });

        const menuItem = menuItems.find((m) => m.id === item.menu_id);
        if (menuItem) {
          await supabase
            .from("menus")
            .update({ stock_quantity: menuItem.stock_quantity - item.quantity })
            .eq("id", item.menu_id);
        }
      }

      res.status(201).json({ order_id });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
);
// PATCH /api/v1/orders/:orderId/cancel - Cancel an order
ordersRouter.patch(
  "/:orderId/cancel",
  param("orderId").isUUID(),
  async (req: AuthenticatedRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { orderId } = req.params;

    try {
      // Update order status to cancelled
      const { data: updatedOrder, error: updateError } = await supabase
        .from("orders")
        .update({ status: "cancelled" })
        .eq("id", orderId)
        .eq("user_id", req.user.sub)
        .select("id")
        .single();

      if (updateError) {
        throw updateError;
      }

      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found or not authorized." });
      }

      // Get order items to replenish stock
      const { data: orderItems, error: itemsError } = await supabase
        .from("order_items")
        .select("menu_id, quantity")
        .eq("order_id", orderId);

      if (itemsError) {
        throw itemsError;
      }

      // Replenish stock for each item
      for (const item of orderItems) {
        const { data: menuItem } = await supabase
          .from("menus")
          .select("stock_quantity")
          .eq("id", item.menu_id)
          .single();

        if (menuItem) {
          await supabase
            .from("menus")
            .update({ stock_quantity: menuItem.stock_quantity + item.quantity })
            .eq("id", item.menu_id);
        }
      }

      res.json({ message: "Order cancelled and stock replenished." });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
);
