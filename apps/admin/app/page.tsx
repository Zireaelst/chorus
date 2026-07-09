import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = { title: 'Chorus Admin' }

export default function AdminPage() {
  redirect('/marketplace')
}
