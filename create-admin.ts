import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf8');
const env: Record<string, string> = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1]] = match[2].replace(/^["']|["']$/g, '').trim();
  }
});

const supabase = createClient(env['VITE_SUPABASE_URL'], env['VITE_SUPABASE_PUBLISHABLE_KEY']);

async function main() {
  console.log('Attempting to create admin user...');
  const { data, error } = await supabase.auth.signUp({
    email: 'admin@riddhisiddhi.com',
    password: 'Password123!'
  });
  
  if (error) {
    console.error('\nFailed:', error.message);
  } else {
    console.log('\nAdmin user created successfully! Email: admin@riddhisiddhi.com | Password: Password123!');
  }
}

main();
