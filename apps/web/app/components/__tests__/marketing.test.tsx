import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { DisclosureDemo } from '../DisclosureDemo'
import { vi, describe, it, expect } from 'vitest'

describe('Marketing Sections', () => {
    describe('DisclosureDemo', () => {
        it('renders without making network calls and switches views based on static fixture', async () => {
            // No fetch mocking is needed because it uses a static fixture directly
            const fetchSpy = vi.spyOn(global, 'fetch')
            
            render(<DisclosureDemo />)
            
            // Hospital view by default
            expect(screen.getByText('1,204')).toBeTruthy()
            
            // Switch to Sponsor view
            fireEvent.click(screen.getByText(/sponsor view/i))
            
            await waitFor(() => {
                expect(screen.getByText('1,204')).toBeTruthy()
            })

            // Switch to Regulator view
            fireEvent.click(screen.getByText(/regulator view/i))
            
            await waitFor(() => {
                expect(screen.getAllByText('Redacted').length).toBeGreaterThan(0)
            })

            // Assert no network calls were made
            expect(fetchSpy).not.toHaveBeenCalled()
            fetchSpy.mockRestore()
        })
    })
})
