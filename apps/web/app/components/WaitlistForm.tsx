'use client'
import * as React from 'react'

import { useActionState } from 'react'
import { Button } from '@chorus/ui'
import { Input } from '@chorus/ui'
import { joinWaitlist, type WaitlistState } from '../actions/joinWaitlist'

const initialState: WaitlistState = {
  status: 'idle',
}

export function WaitlistForm() {
  const [state, formAction, isPending] = useActionState(joinWaitlist, initialState)

  return (
    <div className="w-full max-w-md mx-auto">
      <form action={formAction} className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input 
            type="email" 
            name="email" 
            placeholder="Enter your email" 
            aria-label="Email address for waitlist"
            required
            disabled={isPending}
            intent={state.status === 'error' ? 'error' : 'default'}
            className="flex-1"
          />
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Joining...' : 'Join Waitlist'}
          </Button>
        </div>
        
        <div aria-live="polite" className="text-sm min-h-[20px]">
          {state.status === 'success' && (
            <p className="text-status-success">{state.message}</p>
          )}
          {state.status === 'duplicate' && (
            <p className="text-text-secondary">{state.message}</p>
          )}
          {state.status === 'error' && (
            <p className="text-status-error">{state.message}</p>
          )}
        </div>
      </form>
    </div>
  )
}
