'use server'

import { apiClient } from '../lib/api-client'
import { revalidatePath } from 'next/cache'

export async function searchCohorts(formData: FormData) {
  const icd10 = formData.get('icd10') as string
  const minAge = formData.get('minAge') as string
  const maxAge = formData.get('maxAge') as string
  const biomarkers = formData.get('biomarkers') as string

  // Build query string
  const params = new URLSearchParams()
  if (icd10) params.append('icd10', icd10)
  if (minAge) params.append('minAge', minAge)
  if (maxAge) params.append('maxAge', maxAge)
  if (biomarkers) params.append('biomarkers', biomarkers)

  try {
    const data = await apiClient(`/cohorts/search?${params.toString()}`)
    return { success: true, items: data.items }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to execute query' }
  }
}

export async function requestCohortAccess(cohortId: string, justification: string) {
  try {
    await apiClient(`/cohorts/${cohortId}/access-requests`, {
      method: 'POST',
      body: JSON.stringify({ justification }),
    })
    
    // Revalidate the dashboard so the user sees the updated state if applicable
    revalidatePath('/dashboard')
    
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to request access' }
  }
}
