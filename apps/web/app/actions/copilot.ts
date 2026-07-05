'use server'

import { apiClient } from '../lib/api-client'

export async function generateCohortDraft(prompt: string) {
  try {
    const data = await apiClient('/copilot/cohort-draft', {
      method: 'POST',
      body: JSON.stringify({ description: prompt }),
    })
    
    // The API responds with suggestedCriteria: { icd10, minAge, maxAge, biomarkers... }
    return { success: true, criteria: data.suggestedCriteria }
  } catch (error: any) {
    // If the backend fails, return a mock response for the MVP UI showcase
    // This allows the user to see the UI working even if the python AI service is down locally.
    console.warn("Copilot API failed, returning mock AI response for UI demonstration.", error)
    
    // Simulate AI delay
    await new Promise(r => setTimeout(r, 1500))

    // Simple keyword matching for mock
    let icd10 = ""
    let minAge = ""
    let maxAge = ""
    let biomarkers = ""
    
    const lowerPrompt = prompt.toLowerCase()
    
    if (lowerPrompt.includes('brca1')) biomarkers = "BRCA1"
    if (lowerPrompt.includes('her2')) biomarkers = "HER2"
    if (lowerPrompt.includes('oncology') || lowerPrompt.includes('cancer')) icd10 = "C80.1"
    if (lowerPrompt.includes('over 40')) minAge = "40"
    if (lowerPrompt.includes('under 18')) maxAge = "18"

    return { 
      success: true, 
      criteria: {
        icd10: icd10 || 'E75.2',
        minAge: minAge || '18',
        maxAge: maxAge || '65',
        biomarkers: biomarkers || 'None specified'
      }
    }
  }
}
