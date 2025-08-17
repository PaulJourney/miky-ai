require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

console.log('URL:', supabaseUrl)
console.log('Service key length:', supabaseServiceKey?.length)

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function testConnection() {
  try {
    console.log('🔵 Testing Supabase connection...')

    // Test basic connection
    const { data, error } = await supabase
      .from('auth.users')
      .select('count(*)')
      .limit(1)

    if (error) {
      console.log('Connection test result:', error)
    } else {
      console.log('✅ Supabase connected successfully!')
    }

    // Try to create basic tables manually
    console.log('Creating basic settings table...')

    const { error: settingsError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS settings (
          id SERIAL PRIMARY KEY,
          key TEXT UNIQUE NOT NULL,
          value TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        );

        INSERT INTO settings (key, value) VALUES
        ('max_file_size_mb', '20'),
        ('paypal_email', 'support@miky.ai')
        ON CONFLICT (key) DO NOTHING;
      `
    })

    if (settingsError) {
      console.log('Settings table creation:', settingsError)
    } else {
      console.log('✅ Basic tables created!')
    }

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

testConnection().catch(console.error)
