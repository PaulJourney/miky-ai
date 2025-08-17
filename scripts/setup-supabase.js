require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupDatabase() {
  try {
    console.log('🔵 Setting up Supabase database...')

    // Read SQL schema
    const schema = fs.readFileSync('./supabase-schema.sql', 'utf8')

    // Execute schema
    console.log('Executing database schema...')
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_string: schema
    })

    if (error) {
      console.error('❌ Error executing schema:', error)
      return
    }

    console.log('✅ Database schema executed successfully!')

    // Verify tables were created
    console.log('Verifying tables...')
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')

    if (tablesError) {
      console.log('Could not verify tables, but schema execution completed.')
    } else {
      console.log('📊 Tables created:', tables.map(t => t.table_name))
    }

  } catch (error) {
    console.error('❌ Error setting up database:', error)
  }
}

setupDatabase().catch(console.error)
