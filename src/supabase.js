const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_PUBLIC_API_KEY;

if (!SUPABASE_URL ||!SUPABASE_KEY) {
    throw new Error('Please define SUPABASE_URL and SUPABASE_PUBLIC_API_KEY in your .env file');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;
