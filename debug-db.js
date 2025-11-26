import { createClient } from '@supabase/supabase-js';
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

async function test() {
    const logs = [];
    const log = (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : a).join(' '));

    try {
        log('Testing DB connection...');
        const { data, error } = await supabase.from('users').select('*').limit(1);
        if (error) {
            log('Error selecting from users:', error);
        } else {
            log('Users table exists. Connection successful.');
        }

        const email = `test-${Date.now()}@example.com`;
        const { error: insertError } = await supabase.from('users').insert({
            email,
            password_hash: 'hash'
        });

        if (insertError) {
            log('Error inserting user:', insertError);
        } else {
            log('Insert successful.');
        }
    } catch (err) {
        log('Unexpected error:', err);
    }

    fs.writeFileSync('debug-output.txt', logs.join('\n'));
    console.log('Debug finished. Check debug-output.txt');
}

test();
