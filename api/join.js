import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  try {
    const { error } = await supabase
      .from('waitlist')
      .insert([{ email: email }]);

    if (error) {
      throw error;
    }

    return res.status(200).json({ message: 'Success' });
    
  } catch (error) {
    console.error('Supabase Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
