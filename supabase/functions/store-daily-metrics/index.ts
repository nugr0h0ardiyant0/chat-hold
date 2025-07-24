import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get target date from request body or use current date
    const body = await req.json().catch(() => ({}))
    const targetDate = body.date || new Date().toISOString().split('T')[0]

    console.log(`Storing daily metrics for date: ${targetDate}`)

    // Call the store_daily_metrics function
    const { data, error } = await supabaseClient
      .rpc('store_daily_metrics', { target_date: targetDate })

    if (error) {
      console.error('Error storing daily metrics:', error)
      throw error
    }

    console.log('Daily metrics stored successfully')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Daily metrics stored for ${targetDate}`,
        data 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in store-daily-metrics function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})