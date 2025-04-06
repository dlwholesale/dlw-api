const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SECRET_API_KEY;

if (!SUPABASE_URL ||!SUPABASE_KEY) {
    throw new Error('Please define SUPABASE_URL and SUPABASE_PRIVATE_API_KEY in your .env file');
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = supabaseAdmin;
