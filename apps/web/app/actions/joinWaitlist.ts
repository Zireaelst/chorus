'use server'

export type WaitlistState = {
  status: 'idle' | 'success' | 'error' | 'duplicate'
  message?: string
}

export async function joinWaitlist(prevState: WaitlistState, formData: FormData): Promise<WaitlistState> {
  const email = formData.get('email')

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return { status: 'error', message: 'Please provide a valid email address.' }
  }

  // No database configured — return a graceful message
  return { status: 'success', message: 'Thank you! We\'ll be in touch soon.' }
}
