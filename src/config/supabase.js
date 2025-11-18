const {createClient} = require('@supabase/supabase-js');

//leo las claves del env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

//creamos y exportamos el cliente de supabase
const supabase = createClient(supabaseUrl,supabaseKey);

module.exports = supabase;