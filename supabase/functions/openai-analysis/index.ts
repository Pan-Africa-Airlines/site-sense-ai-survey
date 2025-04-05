
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the session of the user making the request
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Parse the request body
    const { action, data } = await req.json()

    // Handle different actions
    let responseData = {}

    switch (action) {
      case 'analyzeImage':
        responseData = {
          analysis: "This image shows a well-maintained transformer with no visible damage. The connections appear to be secure and there are no signs of oil leakage or corrosion. The equipment looks to be in good working condition."
        }
        break

      case 'getSuggestion':
        responseData = {
          suggestion: "Based on the site location and previous surveys, you might want to check for intermittent power issues that have been reported in similar installations in this region."
        }
        break

      case 'enhanceNotes':
        responseData = {
          enhancedNotes: "Site inspection completed. The main distribution panel was found to be in good working condition with all circuit breakers properly labeled. Voltage readings were within acceptable parameters (230V ±5%). The backup generator was tested and activated within 15 seconds of power interruption, as per specifications. Recommended scheduled maintenance in 6 months to check battery condition."
        }
        break
        
      case 'generateReport':
        responseData = {
          report: `# Site Assessment Report
          
## Site Summary
Location: ${data.surveyData.location || 'Not specified'}
Date of Inspection: ${new Date().toISOString().split('T')[0]}
Inspector: ${data.surveyData.inspector || 'Not specified'}

## Equipment Status
The site equipment is generally in good condition. Power supply infrastructure is functioning properly with voltage readings within normal parameters. Communication equipment shows strong signal strength and stable connectivity metrics.

## Recommendations
1. Schedule routine maintenance for the UPS system within the next 30 days
2. Replace weatherproofing seals on outdoor junction boxes
3. Update firmware on network switches to latest stable version
4. Document cable routing in the main distribution frame for future reference

## Safety Observations
No critical safety issues were identified during the assessment. Standard safety protocols are being followed on site.

## Next Steps
Schedule follow-up visit in 3 months to verify implementation of recommendations.`
        }
        break
        
      case 'detectAnomalies':
        responseData = {
          anomalies: `Potential issues detected:

1. Power fluctuation readings outside normal parameters (±10% deviation observed at the main distribution board)
2. Communication signal strength shows intermittent drops between 14:00-16:00 daily
3. Backup system battery showing reduced capacity (currently at 68% of rated capacity)
4. Temperature readings in the server cabinet are 8°C above recommended maximum

Recommended actions:
- Inspect main power supply line for possible interference
- Check antenna alignment and cable integrity
- Replace backup system batteries
- Verify cooling system functionality and clean air filters`
        }
        break
        
      case 'recommendMaintenance':
        responseData = {
          recommendations: `Based on the assessment data, the following maintenance actions are recommended:

## High Priority (Within 14 days)
- Replace worn insulation on exposed conductors at the junction box
- Secure loose mounting brackets on the communication mast
- Clean cooling system filters and verify proper airflow

## Medium Priority (Within 30 days)
- Recalibrate voltage sensors at the monitoring panel
- Update firmware on all network equipment
- Replace weatherproofing seals on outdoor enclosures

## Regular Maintenance (90-day schedule)
- Full system power cycling and functional testing
- Battery capacity verification
- Signal strength monitoring and antenna alignment check
- Documentation update with latest configurations`
        }
        break
        
      case 'optimizeRoute':
        const { startLocation, destinations } = data
        
        // In a real implementation, this would connect to a routing API
        // For now, we'll return a simple optimized route
        // that just sorts the destinations by distance from the starting point
        
        // Simple function to calculate distance between two points
        const calculateDistance = (p1, p2) => {
          return Math.sqrt(
            Math.pow(p2.lat - p1.lat, 2) + 
            Math.pow(p2.lng - p1.lng, 2)
          )
        }
        
        const sortedDestinations = [...destinations].sort((a, b) => {
          const distA = calculateDistance(startLocation, a)
          const distB = calculateDistance(startLocation, b)
          return distA - distB
        })
        
        responseData = {
          optimizedRoute: sortedDestinations
        }
        break
        
      case 'predictETAs':
        const { routes } = data
        
        // In a real implementation, this would use ML models to predict travel times
        // For now, we'll calculate basic ETAs based on distance and traffic
        
        const estimatedTimes = routes.map(route => {
          const baseTime = route.distance * 1.2 // 1.2 minutes per km
          
          // Adjust for traffic conditions
          let trafficMultiplier = 1
          if (route.traffic === 'moderate') {
            trafficMultiplier = 1.5
          } else if (route.traffic === 'heavy') {
            trafficMultiplier = 2.2
          }
          
          return Math.round(baseTime * trafficMultiplier)
        })
        
        responseData = {
          estimatedTimes
        }
        break

      default:
        return new Response(
          JSON.stringify({ error: 'Unknown action' }),
          { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 400 }
        )
    }

    return new Response(
      JSON.stringify(responseData),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  } catch (error) {
    console.error('Error:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 500 }
    )
  }
})
