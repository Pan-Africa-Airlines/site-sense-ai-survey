
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

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
    const { action, data } = await req.json()
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not set')
    }
    
    // Different handlers for different action types
    switch (action) {
      case 'analyzeImage':
        return await handleImageAnalysis(data, openAIApiKey, corsHeaders)
      case 'enhanceNotes':
        return await handleEnhanceNotes(data, openAIApiKey, corsHeaders)
      case 'getSuggestion':
        return await handleGetSuggestion(data, openAIApiKey, corsHeaders)
      case 'generateReport':
        return await handleGenerateReport(data, openAIApiKey, corsHeaders)
      case 'detectAnomalies':
        return await handleDetectAnomalies(data, openAIApiKey, corsHeaders)
      case 'recommendMaintenance':
        return await handleRecommendMaintenance(data, openAIApiKey, corsHeaders)
      default:
        throw new Error(`Unsupported action: ${action}`)
    }
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

async function handleImageAnalysis(data: any, openAIApiKey: string, corsHeaders: HeadersInit) {
  const { imageData, field, prompt } = data
  
  // Default prompts based on field type
  const defaultPrompts: Record<string, string> = {
    'buildingPhoto': 'Analyze this building photo and describe its condition, access points, and any visible issues that might affect network equipment installation.',
    'cabinetLocationPhoto': 'Analyze this network cabinet location and describe the space, ventilation, and suitability for equipment installation.',
    'equipmentRoomPhotos': 'Analyze this equipment room photo and describe its layout, existing equipment, and any issues that might affect new installations.',
    'dcPowerDistributionPhotos': 'Analyze this power distribution photo and identify any safety concerns, capacity issues, or maintenance needs.',
    'transportEquipmentPhotos': 'Analyze this transport equipment photo and identify the equipment type, condition, and any visible issues.',
    'odfPhotos': 'Analyze this Optical Distribution Frame (ODF) photo and describe its configuration, available ports, and condition.',
    'accessEquipmentPhotos': 'Analyze this access equipment photo and provide details on its condition and configuration.',
    'cableRoutingPhotos': 'Analyze this cable routing photo and describe the cable management, any issues, and suggestions for improvement.',
    'ceilingHvacPhotos': 'Analyze this HVAC/ceiling photo and identify cooling capacity, airflow patterns, and potential concerns for equipment cooling.'
  }
  
  const analysisPrompt = prompt || defaultPrompts[field] || 'Analyze this technical image and provide detailed observations about equipment condition, installation quality, and any potential issues.'
  
  // Call OpenAI's vision API with the image
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openAIApiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a telecommunications and electrical engineering expert specialized in analyzing site survey photos for network installations. Provide concise, technical assessments focusing on equipment condition, installation quality, potential issues, and recommendations. Your analysis should be no more than 2-3 sentences.'
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: analysisPrompt },
            { type: 'image_url', image_url: { url: imageData } }
          ]
        }
      ],
      max_tokens: 300
    })
  })
  
  const result = await response.json()
  return new Response(
    JSON.stringify({ analysis: result.choices[0].message.content }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleEnhanceNotes(data: any, openAIApiKey: string, corsHeaders: HeadersInit) {
  const { notes, prompt } = data
  
  const enhancePrompt = prompt || 'Improve these technical notes for clarity, completeness, and professionalism.'
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openAIApiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert technical writer specialized in telecommunication site surveys. Your task is to enhance technical notes by improving clarity, structure, and technical accuracy while maintaining the original meaning. Add relevant technical details where appropriate.'
        },
        {
          role: 'user',
          content: `${enhancePrompt}\n\nOriginal notes:\n${notes}`
        }
      ],
      max_tokens: 1000
    })
  })
  
  const result = await response.json()
  return new Response(
    JSON.stringify({ enhancedNotes: result.choices[0].message.content }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleGetSuggestion(data: any, openAIApiKey: string, corsHeaders: HeadersInit) {
  const { fieldName, currentData } = data
  
  // Query Supabase to get historical data for better suggestions
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://bvfncyjnhuvrkjixgiuc.supabase.co'
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY')
  
  if (!supabaseKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  // Fetch historical survey data (limited to 20)
  const { data: historicalSurveys, error } = await supabase
    .from('site_surveys')
    .select('survey_data, site_type, region')
    .limit(20)
  
  if (error) {
    console.error('Error fetching historical survey data:', error)
  }
  
  // Create field-specific prompts
  const fieldContextMap: Record<string, string> = {
    'siteCondition': 'Suggest a detailed site condition assessment based on the entered information.',
    'networkAvailability': 'Suggest network availability details based on the region and site type.',
    'powerInfrastructure': 'Suggest power infrastructure specifications suitable for this site type.',
    'coolingRequirements': 'Suggest cooling requirements based on the equipment and site conditions.',
    'equipmentRecommendation': 'Suggest optimal networking equipment based on the site requirements.',
    'installationNotes': 'Suggest comprehensive installation notes for this type of site.',
    'accessRequirements': 'Suggest access requirements based on the site type and location.',
    'securityRequirements': 'Suggest security requirements based on the site type and location.',
    'cableAccess': 'Suggest cable access methods based on the building type.',
    'fireProtection': 'Suggest appropriate fire protection measures for this type of site.',
    'coolingMethod': 'Suggest optimal cooling methods based on the equipment and site location.',
    'roomCondition': 'Suggest room condition requirements for optimal equipment operation.',
    'generalRemarks': 'Suggest general remarks based on all the information provided about this site.'
  }
  
  // Create a prompt that includes historical data for context
  let prompt = `Based on the current survey for a ${currentData.siteType || 'unknown'} site in the ${currentData.region || 'unknown'} region, suggest appropriate values for the field "${fieldName}".\n\n`
  
  // Add the field-specific context
  prompt += fieldContextMap[fieldName] || `Suggest appropriate values for the ${fieldName} field based on the site information.`
  
  // Add historical context if available
  if (historicalSurveys && historicalSurveys.length > 0) {
    prompt += `\n\nFor context, here are some examples of previous entries for similar sites:`
    
    const relevantSurveys = historicalSurveys
      .filter(survey => 
        (currentData.siteType ? survey.site_type === currentData.siteType : true) &&
        (currentData.region ? survey.region === currentData.region : true)
      )
      .slice(0, 5)
    
    if (relevantSurveys.length > 0) {
      relevantSurveys.forEach((survey, index) => {
        const fieldValue = getNestedValue(survey.survey_data, fieldName)
        if (fieldValue) {
          prompt += `\nExample ${index + 1}: "${fieldValue}"`
        }
      })
    }
  }
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openAIApiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a telecommunications infrastructure expert specialized in site surveys for network installations. Provide concise, detailed, and technically accurate suggestions based on the current survey data and historical patterns.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 300
    })
  })
  
  const result = await response.json()
  return new Response(
    JSON.stringify({ suggestion: result.choices[0].message.content }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleGenerateReport(data: any, openAIApiKey: string, corsHeaders: HeadersInit) {
  const { surveyData } = data
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openAIApiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a telecommunications expert specialized in generating technical reports from site survey data. Create a comprehensive, well-structured report that highlights key findings, recommendations, and required actions.'
        },
        {
          role: 'user',
          content: `Generate a comprehensive site survey report from the following data:\n${JSON.stringify(surveyData, null, 2)}`
        }
      ],
      max_tokens: 2000
    })
  })
  
  const result = await response.json()
  return new Response(
    JSON.stringify({ report: result.choices[0].message.content }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleDetectAnomalies(data: any, openAIApiKey: string, corsHeaders: HeadersInit) {
  const { surveyData } = data
  
  // Query Supabase to get historical data for anomaly detection
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://bvfncyjnhuvrkjixgiuc.supabase.co'
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY')
  
  if (!supabaseKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  // Fetch historical survey data for similar sites
  const { data: historicalSurveys, error } = await supabase
    .from('site_surveys')
    .select('survey_data, site_type')
    .eq('site_type', surveyData.siteType)
    .limit(10)
  
  if (error) {
    console.error('Error fetching historical survey data:', error)
  }
  
  let prompt = `Analyze this site survey data and identify any unusual readings, inconsistencies, or conditions that might require attention.\n\nCurrent survey:\n${JSON.stringify(surveyData, null, 2)}`
  
  // Add historical context if available
  if (historicalSurveys && historicalSurveys.length > 0) {
    prompt += `\n\nFor context, here are typical values from similar ${surveyData.siteType} sites:`
    
    // Extract key metrics for comparison
    const metrics = ['roomTemperature', 'chargerALoadCurrent', 'chargerBLoadCurrent', 'coolingRating']
    
    metrics.forEach(metric => {
      const values = historicalSurveys
        .map(survey => getNestedValue(survey.survey_data, metric))
        .filter(Boolean)
      
      if (values.length > 0) {
        const average = values.reduce((sum, val) => sum + parseFloat(val), 0) / values.length
        prompt += `\nTypical ${metric}: ${average.toFixed(2)}`
      }
    })
  }
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openAIApiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a telecommunications and electrical engineering expert specialized in detecting anomalies in site survey data. Identify potential issues, unusual readings, and inconsistencies that might indicate problems requiring attention.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1000
    })
  })
  
  const result = await response.json()
  return new Response(
    JSON.stringify({ anomalies: result.choices[0].message.content }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleRecommendMaintenance(data: any, openAIApiKey: string, corsHeaders: HeadersInit) {
  const { surveyData, imageData } = data
  
  let messages = [
    {
      role: 'system',
      content: 'You are a telecommunications maintenance expert specializing in predictive maintenance. Analyze the site survey data and images to provide specific maintenance recommendations, prioritized by urgency.'
    },
    {
      role: 'user',
      content: `Based on this site survey data, provide predictive maintenance recommendations:\n${JSON.stringify(surveyData, null, 2)}`
    }
  ]
  
  // Add image analysis if available
  if (imageData) {
    messages.push({
      role: 'user',
      content: [
        { type: 'text', text: 'Also analyze this image of the equipment:' },
        { type: 'image_url', image_url: { url: imageData } }
      ]
    })
  }
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openAIApiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages,
      max_tokens: 1000
    })
  })
  
  const result = await response.json()
  return new Response(
    JSON.stringify({ recommendations: result.choices[0].message.content }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

// Helper function to get nested values from an object
function getNestedValue(obj: any, path: string) {
  if (!obj) return null
  
  const keys = path.split('.')
  let value = obj
  
  for (const key of keys) {
    if (value === null || value === undefined || typeof value !== 'object') {
      return null
    }
    value = value[key]
  }
  
  return value
}
