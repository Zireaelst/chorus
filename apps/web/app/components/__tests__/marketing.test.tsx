import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { DisclosureDemo } from '../DisclosureDemo'
import MechanismScene from '../MechanismScene'
import { vi } from 'vitest'

describe('Marketing Sections', () => {
    describe('DisclosureDemo', () => {
        it('renders without making network calls and switches views based on static fixture', async () => {
            // No fetch mocking is needed because it uses a static fixture directly
            const fetchSpy = vi.spyOn(global, 'fetch')
            
            render(<DisclosureDemo />)
            
            // Hospital view by default
            expect(screen.getByText('1,492')).toBeInTheDocument()
            
            // Switch to Sponsor view
            fireEvent.click(screen.getByText('Sponsor View'))
            
            await waitFor(() => {
                expect(screen.getByText('1,000 - 5,000')).toBeInTheDocument()
            })

            // Switch to Regulator view
            fireEvent.click(screen.getByText('Regulator View'))
            
            await waitFor(() => {
                expect(screen.getAllByText('Redacted').length).toBeGreaterThan(0)
            })

            // Assert no network calls were made
            expect(fetchSpy).not.toHaveBeenCalled()
            fetchSpy.mockRestore()
        })
    })

    describe('MechanismScene', () => {
        let matchMediaMock: ReturnType<typeof vi.fn>

        beforeEach(() => {
            matchMediaMock = vi.fn().mockImplementation((query) => ({
                matches: query === '(prefers-reduced-motion: reduce)',
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
            }))
            window.matchMedia = matchMediaMock
        })

        afterEach(() => {
            matchMediaMock.mockRestore()
        })

        it('collapses to static layout under prefers-reduced-motion', () => {
            render(<MechanismScene />)
            
            // Should render the static fallback text rather than the GSAP scroll container logic
            expect(screen.getByText('[RAW_DATA_BLOCK]')).toBeInTheDocument()
            expect(screen.getByText('2026-07-04T14:32:01Z • 0x8f2a...3b9c')).toBeInTheDocument()
        })
    })
})
