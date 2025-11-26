import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';

// Manually parse .env
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) envVars[key.trim()] = value.trim();
});

const supabase = createClient(envVars.SUPABASE_URL, envVars.SUPABASE_SERVICE_ROLE_KEY);

async function seedAdmin() {
    const username = 'admin';
    const password = 'admin';
    const email = 'admin@mealora.com';

    console.log('Checking for existing admin user...');
    const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

    if (existingUser) {
        console.log('Admin user already exists.');
        return;
    }

    console.log('Creating admin user...');
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const { data, error } = await supabase
        .from('users')
        .insert([
            {
                username,
                email,
                password_hash,
                role: 'admin'
            }
        ])
        .select();

    if (error) {
        console.error('Error creating admin user:', error);
    } else {
        console.log('Admin user created successfully:', data);
    }
}

seedAdmin();
