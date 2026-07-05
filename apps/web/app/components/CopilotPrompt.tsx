'use client'

import * as React from 'react'
import { useState } from 'react'
import { IconButton } from '@chorus/ui'

interface CopilotPromptProps {
  onCriteriaGenerated: (criteria: any) => void;
}

export function CopilotPrompt({ onCriteriaGenerated }: CopilotPromptProps) {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  async function handleGenerate(e?: React.FormEvent) {
    if (e) e.preventDefault()
    if (!prompt.trim() || isGenerating) return

    setIsGenerating(true)
    try {
      // Dynamic import to avoid SSR issues if the action uses node modules
      const { generateCohortDraft } = await import('../actions/copilot')
      const response = await generateCohortDraft(prompt)
      
      if (response.success && response.criteria) {
        onCriteriaGenerated(response.criteria)
        setPrompt('')
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className={`relative flex items-center w-full p-2 rounded-2xl bg-black/40 backdrop-blur-md border transition-all duration-500 ${isGenerating ? 'border-accent-verify/50 shadow-[0_0_15px_rgba(35,219,165,0.2)]' : 'border-white/10 focus-within:border-white/30'}`}>
      <div className="pl-4 pr-2 opacity-50 flex items-center justify-center">
        {/* Sparkles Icon */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={isGenerating ? "text-accent-verify animate-pulse" : "text-white"}>
          <path d="M10 2L12.1609 8.48119L19 10L12.1609 11.5188L10 18L7.83913 11.5188L1 10L7.83913 8.48119L10 2Z" fill="currentColor"/>
          <path d="M19 14L19.8646 16.5925L23 17L19.8646 17.4075L19 20L18.1354 17.4075L15 17L18.1354 16.5925L19 14Z" fill="currentColor"/>
        </svg>
      </div>
      <form onSubmit={handleGenerate} className="flex-1 flex items-center">
        <input 
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask Copilot to build your query... (e.g. 'Find patients over 40 with BRCA1 mutations')"
          disabled={isGenerating}
          className="w-full bg-transparent border-none text-white text-sm focus:outline-none focus:ring-0 px-2 placeholder:text-white/30 disabled:opacity-50"
        />
        <button 
          type="submit" 
          disabled={!prompt.trim() || isGenerating}
          className="ml-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:hover:bg-white/10 text-white rounded-xl px-4 py-2 text-xs font-medium transition-colors"
        >
          {isGenerating ? 'Thinking...' : 'Generate'}
        </button>
      </form>
    </div>
  )
}
