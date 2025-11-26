import { Router } from 'express';
import { supabase } from '../lib/supabase';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { registerSchema, loginSchema } from '../../shared/schema';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password } = registerSchema.parse(req.body);

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const { data, error } = await supabase
      .from('users')
      .insert([{ email, password_hash }])
      .select('id, email')
      .single();

    if (error) {
      if (error.code === '23505') { // Unique violation error code
        return res.status(409).json({ message: 'Email already registered' });
      }
      throw error;
    }

    res.status(201).json(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error('Register error:', error);
    import('fs').then(fs => fs.appendFileSync('server-error.log', `${new Date().toISOString()} - Register error: ${JSON.stringify(error, Object.getOwnPropertyNames(error))} \n`));
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const loginSchema = z.object({
      username: z.string().optional(),
      email: z.string().email().optional(),
      password: z.string(),
    }).refine((data) => data.username || data.email, {
      message: "Either username or email is required",
      path: ["username"],
    });

    const { email, username, password } = loginSchema.parse(req.body);

    let query = supabase.from('users').select('*');
    if (email) {
      query = query.eq('email', email);
    } else if (username) {
      query = query.eq('username', username);
    }

    const { data: userResult, error } = await query.single();

    if (error && error.code === 'PGRST116') { // No rows found
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (error) {
      throw error;
    }

    const user = userResult;

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET as string, {
      expiresIn: '24h',
    });

    res.json({ token, role: user.role });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export const authRoutes = router;
