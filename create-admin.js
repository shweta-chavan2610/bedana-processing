import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envFile = fs.readFileSync('.env', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1]] = match[2].replace(/^["']|["']$/g, '').trim();
  }
});
console.log('Environment variables loaded:', Object.keys(env));
if (!env.VITE_SUPABASE_URL) {
  console.error('Error: VITE_SUPABASE_URL not found in .env file');
  process.exit(1);
}
const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY);

async function main() {
  console.log('Attempting to create admin user...');
  const { data, error } = await supabase.auth.signUp({
    email: 'admin@riddhisiddhi.com',
    password: 'Password123!'
  });
  
  if (error) {
    console.error('\nFailed to create user automatically:', error.message);
    console.log('\nPlease create the user manually in your Supabase Dashboard -> Authentication -> Users.');
  } else {
    console.log('\nAdmin user created successfully!');
    console.log('Email: admin@riddhisiddhi.com');
    console.log('Password: Password123!');
    if (!data.session) {
      console.log('\nNotice: You may need to confirm your email or enable "Auto-Confirm Users" in the Supabase Dashboard -> Authentication -> Providers -> Email.');
    }
  }
}

main();
