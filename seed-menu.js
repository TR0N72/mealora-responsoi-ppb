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

const mealSetItems = [
    {
        name: "Cashew Chicken",
        price: 38000,
        image: "https://api.builder.io/api/v1/image/assets/TEMP/080cf98b332c136dabeaecdc98238dd27761fb6c?width=542",
        category: "Meal Set",
        dietary_tags: ["20% OFF"]
    },
    {
        name: "Tso Chicken",
        price: 40000,
        image: "https://api.builder.io/api/v1/image/assets/TEMP/b4d9b25b2b04d47d52ed108e702d7c1efbd11c36?width=374",
        category: "Meal Set"
    },
    {
        name: "Beef Lo Min",
        price: 48000,
        image: "https://api.builder.io/api/v1/image/assets/TEMP/5233c82b90bb14f282688cd9f6492335bf45a43c?width=462",
        category: "Meal Set"
    },
    {
        name: "Parmesan Kale Pasta",
        price: 42000,
        image: "https://api.builder.io/api/v1/image/assets/TEMP/90ce6cb7896b6ff60752b2b4472a5653a789fa83?width=366",
        category: "Meal Set",
        dietary_tags: ["20% OFF"]
    },
    {
        name: "Soy Glazed Chicken",
        price: 45000,
        image: "https://api.builder.io/api/v1/image/assets/TEMP/f925131b9e3f318a2be087b069ee7ab558481ab1?width=360",
        category: "Meal Set"
    }
];

const snackSetItems = [
    {
        name: "Almond Cookies",
        price: 25000,
        image: "https://api.builder.io/api/v1/image/assets/TEMP/2370cdf41686b0ecf6ce4192ee847274ce7ae15c?width=386",
        category: "Snack Set"
    },
    {
        name: "Dadar Gulung",
        price: 10000,
        image: "https://api.builder.io/api/v1/image/assets/TEMP/0cd45c2a890eb522fd4ec485fefac788592860e8?width=514",
        category: "Snack Set"
    },
    {
        name: "Pastel",
        price: 6000,
        image: "https://api.builder.io/api/v1/image/assets/TEMP/39fcbb828ee027b09e92d2967890ff0ccabe48dd?width=422",
        category: "Snack Set"
    }
];

async function seedMenu() {
    console.log('Seeding menu items...');

    const allItems = [...mealSetItems, ...snackSetItems];

    for (const item of allItems) {
        const { data, error } = await supabase
            .from('menus')
            .insert([item])
            .select();

        if (error) {
            console.error(`Error inserting ${item.name}:`, error);
        } else {
            console.log(`Inserted ${item.name}`);
        }
    }

    console.log('Menu seeding completed.');
}

seedMenu();
