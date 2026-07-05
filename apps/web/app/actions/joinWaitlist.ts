'use server'

import { prisma } from '../../lib/db'

export type WaitlistState = {
  status: 'idle' | 'success' | 'error' | 'duplicate'
  message?: string
}

export async function joinWaitlist(prevState: WaitlistState, formData: FormData): Promise<WaitlistState> {
  const email = formData.get('email')

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return { status: 'error', message: 'Please provide a valid email address.' }
  }

  if (!prisma) {
    // No database configured — return a graceful message
    return { status: 'success', message: 'Thank you! We\'ll be in touch soon.' }
  }

  try {
    await prisma.waitlistSignup.create({
      data: { email },
    })
    return { status: 'success', message: 'You have been added to the waitlist.' }
  } catch (error: any) {
    // Prisma unique constraint violation code is P2002
    if (error.code === 'P2002') {
      return { status: 'duplicate', message: 'This email is already on the waitlist.' }
    }
    return { status: 'error', message: 'An unexpected error occurred. Please try again.' }
  }
}
