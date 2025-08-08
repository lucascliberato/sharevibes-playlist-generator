'use client'

import { useApp } from '@/lib/app-context'
import { QuickPathInput } from './QuickPathInput'
import { PrecisePathInput } from './PrecisePathInput'

export function InputCollection() {
  const { state } = useApp()

  return (
    <div className="py-8">
      {state.selectedPath === 'quick' ? <QuickPathInput /> : <PrecisePathInput />}
    </div>
  )
}
